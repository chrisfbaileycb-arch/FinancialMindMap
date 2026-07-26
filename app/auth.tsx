import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  KeyboardAvoidingView, Platform, StatusBar, TextInput, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAuth as useSupabaseAuth } from '@/template';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const PIN_LENGTH = 6;

export default function AuthScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const {
    setupPin, verifyPin, authenticateWithBiometrics,
    biometricsAvailable, biometricsType, hasPin,
  } = useAuth();
  const { sendOTP, verifyOTPAndLogin, operationLoading } = useSupabaseAuth();
  const router      = useRouter();
  const insets      = useSafeAreaInsets();

  const isEmail = mode === 'email';
  const isSetup = mode === 'setup';

  // PIN state
  const [pin, setPin]               = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStep, setPinStep]       = useState<'enter' | 'confirm'>('enter');

  // Email / OTP state
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Feedback
  const [error, setError]             = useState('');
  const [lockoutSecs, setLockoutSecs] = useState(0);
  const [shakeAnim]                   = useState(new Animated.Value(0));
  const biometricsFired               = useRef(false);

  // Auto-trigger biometrics on login
  useEffect(() => {
    if (mode === 'login' && biometricsAvailable && !biometricsFired.current) {
      biometricsFired.current = true;
      setTimeout(triggerBiometrics, 400);
    }
  }, [biometricsAvailable, mode]);

  // Clear error after 3 s
  useEffect(() => {
    if (!error) return;
    shake();
    const t = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(t);
  }, [error]);

  // Countdown timer (re-schedules itself until 0)
  useEffect(() => {
    if (lockoutSecs <= 0) return;
    const t = setTimeout(() => setLockoutSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [lockoutSecs]);

  const shake = () =>
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();

  // ── Email / OTP ─────────────────────────────────────
  const handleSendOTP = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !e.includes('@')) { setError('Enter a valid email address.'); return; }
    const { error: err } = await sendOTP(e);
    if (err) { setError(err); } else { setOtpSent(true); setError(''); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) { setError('Enter the 4-digit verification code.'); return; }
    const { error: err, user } = await verifyOTPAndLogin(email.trim().toLowerCase(), otp);
    if (err) {
      setError(err);
      setOtp('');
    } else if (user) {
      router.replace(hasPin ? '/auth?mode=login' : '/auth?mode=setup');
    }
  };

  // ── Biometrics ───────────────────────────────────────
  const triggerBiometrics = async () => {
    const ok = await authenticateWithBiometrics();
    if (ok) router.replace('/(tabs)');
  };

  // ── PIN ──────────────────────────────────────────────
  const handleDigit = (d: string) => {
    if (lockoutSecs > 0) return;
    if (isSetup) {
      if (pinStep === 'enter') {
        const np = pin + d;
        setPin(np);
        if (np.length === PIN_LENGTH) setTimeout(() => setPinStep('confirm'), 200);
      } else {
        const nc = confirmPin + d;
        setConfirmPin(nc);
        if (nc.length === PIN_LENGTH) setTimeout(() => completeSetup(nc), 200);
      }
    } else {
      const np = pin + d;
      setPin(np);
      if (np.length === PIN_LENGTH) setTimeout(() => handleLogin(np), 200);
    }
  };

  const handleDelete = () => {
    if (isSetup && pinStep === 'confirm') setConfirmPin(p => p.slice(0, -1));
    else setPin(p => p.slice(0, -1));
  };

  const completeSetup = async (confirmVal: string) => {
    if (pin !== confirmVal) {
      setPin(''); setConfirmPin(''); setPinStep('enter');
      setError('PINs do not match. Please try again.');
    } else {
      await setupPin(pin);
      router.replace('/(tabs)');
    }
  };

  const handleLogin = async (entered: string) => {
    const result = await verifyPin(entered);
    setPin('');
    if (result.valid) {
      router.replace('/(tabs)');
    } else if (result.locked) {
      setLockoutSecs(result.lockoutSeconds);
      setError('');
    } else {
      const rem = result.remainingAttempts;
      setError(`Incorrect PIN · ${rem} attempt${rem !== 1 ? 's' : ''} remaining`);
    }
  };

  const displayPin  = isSetup && pinStep === 'confirm' ? confirmPin : pin;
  const isLocked    = lockoutSecs > 0;

  // ─────────────────────────────────────────────────────
  // EMAIL / OTP SCREEN
  // ─────────────────────────────────────────────────────
  if (isEmail) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            emailStyles.content,
            { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image source={require('@/assets/images/secure-icon.png')} style={styles.logo} contentFit="contain" />
            <Text style={styles.appName}>Financial Mind Map</Text>
            <Text style={styles.title}>{otpSent ? 'Check Your Email' : 'Get Started'}</Text>
            <Text style={styles.subtitle}>
              {otpSent
                ? `We sent a 4-digit code to\n${email}\nEnter it below to continue.`
                : 'Sign in with your email to securely access and link your financial accounts.'}
            </Text>
          </View>

          {!otpSent ? (
            <>
              <View style={emailStyles.field}>
                <Text style={emailStyles.label}>Email Address</Text>
                <TextInput
                  style={emailStyles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="send"
                  onSubmitEditing={handleSendOTP}
                  accessibilityLabel="Email address"
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : <View style={{ height: 20 }} />}
              <Pressable
                style={({ pressed }) => [emailStyles.btn, (pressed || operationLoading) && { opacity: 0.75 }]}
                onPress={handleSendOTP}
                disabled={operationLoading}
                accessibilityLabel="Send verification code"
                accessibilityRole="button"
              >
                <MaterialIcons name="send" size={18} color="#fff" />
                <Text style={emailStyles.btnText}>{operationLoading ? 'Sending…' : 'Send Code'}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={emailStyles.field}>
                <Text style={emailStyles.label}>Verification Code</Text>
                <TextInput
                  style={[emailStyles.input, emailStyles.otpInput]}
                  value={otp}
                  onChangeText={v => setOtp(v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={4}
                  returnKeyType="done"
                  onSubmitEditing={handleVerifyOTP}
                  autoFocus
                  accessibilityLabel="Verification code"
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : <View style={{ height: 20 }} />}
              <Pressable
                style={({ pressed }) => [
                  emailStyles.btn,
                  (pressed || operationLoading || otp.length < 4) && { opacity: 0.65 },
                ]}
                onPress={handleVerifyOTP}
                disabled={operationLoading || otp.length < 4}
                accessibilityLabel="Verify code"
                accessibilityRole="button"
              >
                <MaterialIcons name="verified-user" size={18} color="#fff" />
                <Text style={emailStyles.btnText}>{operationLoading ? 'Verifying…' : 'Verify & Continue'}</Text>
              </Pressable>
              <Pressable
                style={emailStyles.linkBtn}
                onPress={() => { setOtpSent(false); setOtp(''); setError(''); }}
                accessibilityLabel="Change email address"
              >
                <Text style={emailStyles.linkBtnText}>Change email address</Text>
              </Pressable>
              <Pressable
                style={emailStyles.linkBtn}
                onPress={handleSendOTP}
                disabled={operationLoading}
                accessibilityLabel="Resend verification code"
              >
                <Text style={emailStyles.linkBtnText}>Resend code</Text>
              </Pressable>
            </>
          )}

          <View style={styles.secureNote}>
            <MaterialIcons name="lock" size={12} color={Colors.textMuted} />
            <Text style={styles.secureNoteText}>Bank-level encryption · Data never sold</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ─────────────────────────────────────────────────────
  // PIN SCREEN (setup or login)
  // ─────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <View style={[
        styles.container,
        { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl },
      ]}>

        <View style={styles.header}>
          <Image source={require('@/assets/images/secure-icon.png')} style={styles.logo} contentFit="contain" />
          <Text style={styles.appName}>Financial Mind Map</Text>
          <Text style={styles.title}>
            {isSetup
              ? (pinStep === 'enter' ? 'Create Your PIN' : 'Confirm Your PIN')
              : 'Welcome Back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSetup
              ? (pinStep === 'enter' ? 'Choose a 6-digit PIN to protect your app' : 'Re-enter your PIN to confirm')
              : (isLocked ? 'Too many failed attempts. Please wait.' : 'Your financial data is protected on this device')}
          </Text>
        </View>

        {/* Biometrics */}
        {!isSetup && biometricsAvailable && !isLocked && (
          <Pressable
            style={({ pressed }) => [styles.biometricsBtn, pressed && { opacity: 0.75 }]}
            onPress={triggerBiometrics}
            accessibilityLabel={`Unlock with ${biometricsType}`}
            accessibilityRole="button"
          >
            <MaterialIcons
              name={biometricsType === 'Face ID' ? 'face' : 'fingerprint'}
              size={28}
              color={Colors.primary}
            />
            <Text style={styles.biometricsBtnText}>Use {biometricsType}</Text>
          </Pressable>
        )}
        {!isSetup && biometricsAvailable && !isLocked && (
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or enter PIN</Text>
            <View style={styles.orLine} />
          </View>
        )}

        {/* Lockout banner */}
        {isLocked ? (
          <View style={styles.lockoutBanner}>
            <MaterialIcons name="lock-clock" size={22} color={Colors.warning} />
            <Text style={styles.lockoutText}>Try again in {lockoutSecs}s</Text>
          </View>
        ) : null}

        {/* PIN dots */}
        <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < displayPin.length ? styles.dotFilled : styles.dotEmpty,
                isLocked ? styles.dotLocked : null,
              ]}
            />
          ))}
        </Animated.View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={{ height: 24 }} />
        )}

        {/* Keypad */}
        <View style={[styles.keypad, isLocked && { opacity: 0.35 }]}>
          {[['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']].map((row, ri) => (
            <View key={ri} style={styles.keypadRow}>
              {row.map((key, ki) => {
                if (key === '') return <View key={ki} style={styles.keyPlaceholder} />;
                return (
                  <Pressable
                    key={ki}
                    style={({ pressed }) => [styles.key, pressed && !isLocked && styles.keyPressed]}
                    onPress={() => key === '⌫' ? handleDelete() : handleDigit(key)}
                    disabled={isLocked}
                    hitSlop={8}
                    accessibilityLabel={key === '⌫' ? 'Delete digit' : `Digit ${key}`}
                    accessibilityRole="button"
                  >
                    {key === '⌫'
                      ? <MaterialIcons name="backspace" size={22} color={Colors.textPrimary} />
                      : <Text style={styles.keyText}>{key}</Text>}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.secureNote}>
          <MaterialIcons name="lock" size={12} color={Colors.textMuted} />
          <Text style={styles.secureNoteText}>Data stored encrypted on-device only</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', paddingHorizontal: Spacing.xl,
  },
  header: { alignItems: 'center', marginBottom: Spacing.lg },
  logo: { width: 68, height: 68, marginBottom: Spacing.md },
  appName: {
    fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semibold,
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.xl, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: Typography.base * 1.5,
  },
  biometricsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    backgroundColor: Colors.primaryGlow, borderRadius: Radius.xl,
    borderWidth: 1.5, borderColor: Colors.primary + '88', marginBottom: Spacing.lg,
  },
  biometricsBtnText: { fontSize: Typography.md, fontWeight: Typography.semibold, color: Colors.primary },
  orRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    width: '100%', marginBottom: Spacing.md,
  },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.surfaceBorder },
  orText: { fontSize: Typography.xs, color: Colors.textMuted },
  lockoutBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.warningGlow, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.warning + '66',
  },
  lockoutText: { fontSize: Typography.base, color: Colors.warning, fontWeight: Typography.bold },
  dotsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  dot: { width: 18, height: 18, borderRadius: 9 },
  dotFilled: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 8, elevation: 6,
  },
  dotEmpty: { borderWidth: 2, borderColor: Colors.surfaceBorder, backgroundColor: 'transparent' },
  dotLocked: { borderColor: Colors.textMuted, backgroundColor: 'transparent' },
  errorText: { fontSize: Typography.sm, color: Colors.danger, textAlign: 'center', height: 24 },
  keypad: { width: '100%', maxWidth: 320, gap: Spacing.sm, marginTop: Spacing.sm },
  keypadRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  key: {
    flex: 1, height: 68, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  keyPressed: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  keyPlaceholder: { flex: 1, height: 68 },
  keyText: { fontSize: Typography.xl, fontWeight: Typography.semibold, color: Colors.textPrimary },
  secureNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: Spacing.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  secureNoteText: { fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'center' },
});

const emailStyles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.xl, alignItems: 'center' },
  field: { width: '100%', marginBottom: Spacing.sm },
  label: {
    fontSize: Typography.xs, color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm,
  },
  input: {
    width: '100%', backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    color: Colors.textPrimary, fontSize: Typography.base,
  },
  otpInput: { textAlign: 'center', fontSize: 32, fontWeight: '700', letterSpacing: 16 },
  btn: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: Spacing.md, marginTop: Spacing.xs,
  },
  btnText: { fontSize: Typography.base, fontWeight: Typography.bold, color: '#fff' },
  linkBtn: { marginTop: Spacing.md, paddingVertical: Spacing.sm },
  linkBtnText: { fontSize: Typography.sm, color: Colors.textSecondary },
});
