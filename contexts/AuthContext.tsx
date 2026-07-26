import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';

// Versioned keys — v2 hash prevents plaintext PIN storage
const PIN_HASH_KEY  = 'fmm_pin_hash_v2';
const PIN_SALT_KEY  = 'fmm_pin_salt_v1';
const ATTEMPTS_KEY  = 'fmm_pin_attempts_v1';
const LOCKOUT_KEY   = 'fmm_lockout_until_v1';
const OLD_PIN_KEY   = 'fmm_secure_pin'; // legacy plaintext — migrated on first run

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 30_000; // 30 seconds initial lockout

export interface PinVerifyResult {
  valid: boolean;
  locked: boolean;
  remainingAttempts: number;
  lockoutSeconds: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPin: boolean;
  biometricsAvailable: boolean;
  biometricsType: string;
  lockedUntil: number | null;
  failedAttempts: number;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<PinVerifyResult>;
  authenticateWithBiometrics: () => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Crypto helpers ──────────────────────────────────────────────────────────

async function getOrCreateSalt(): Promise<string> {
  let salt = await SecureStore.getItemAsync(PIN_SALT_KEY);
  if (!salt) {
    const bytes = await Crypto.getRandomBytesAsync(16);
    salt = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    await SecureStore.setItemAsync(PIN_SALT_KEY, salt);
  }
  return salt;
}

async function hashPin(pin: string): Promise<string> {
  const salt = await getOrCreateSalt();
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    salt + pin + salt
  );
}

// ── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]             = useState(true);
  const [hasPin, setHasPin]                   = useState(false);
  const [biometricsAvailable, setBioAvail]    = useState(false);
  const [biometricsType, setBioType]          = useState('Biometrics');
  const [lockedUntil, setLockedUntil]         = useState<number | null>(null);
  const [failedAttempts, setFailedAttempts]   = useState(0);

  useEffect(() => { initAuth(); }, []);

  const initAuth = async () => {
    try {
      const [hash, compatible, enrolled, types, lockStr, attStr] = await Promise.all([
        SecureStore.getItemAsync(PIN_HASH_KEY),
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
        SecureStore.getItemAsync(LOCKOUT_KEY),
        SecureStore.getItemAsync(ATTEMPTS_KEY),
      ]);

      // Migrate: silently remove old plaintext PIN
      SecureStore.deleteItemAsync(OLD_PIN_KEY).catch(() => {});

      setHasPin(!!hash);

      const canBio = compatible && enrolled;
      setBioAvail(canBio);
      if (canBio) {
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBioType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBioType('Touch ID');
        }
      }

      if (lockStr) {
        const lt = parseInt(lockStr, 10);
        if (Date.now() < lt) {
          setLockedUntil(lt);
        } else {
          await Promise.all([
            SecureStore.deleteItemAsync(LOCKOUT_KEY),
            SecureStore.deleteItemAsync(ATTEMPTS_KEY),
          ]);
        }
      }
      if (attStr) setFailedAttempts(parseInt(attStr, 10));
    } catch { /* non-fatal */ } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Financial Mind Map',
        fallbackLabel: 'Use PIN instead',
        disableDeviceFallback: true,
        cancelLabel: 'Cancel',
      });
      if (result.success) { setIsAuthenticated(true); return true; }
      return false;
    } catch { return false; }
  };

  const setupPin = async (pin: string): Promise<void> => {
    const hash = await hashPin(pin);
    await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
    await Promise.all([
      SecureStore.deleteItemAsync(ATTEMPTS_KEY).catch(() => {}),
      SecureStore.deleteItemAsync(LOCKOUT_KEY).catch(() => {}),
    ]);
    setHasPin(true);
    setIsAuthenticated(true);
    setLockedUntil(null);
    setFailedAttempts(0);
  };

  const verifyPin = async (pin: string): Promise<PinVerifyResult> => {
    // 1. Check active lockout
    const lockStr = await SecureStore.getItemAsync(LOCKOUT_KEY);
    if (lockStr) {
      const lt = parseInt(lockStr, 10);
      if (Date.now() < lt) {
        return {
          valid: false, locked: true,
          remainingAttempts: 0,
          lockoutSeconds: Math.ceil((lt - Date.now()) / 1000),
        };
      }
      await Promise.all([
        SecureStore.deleteItemAsync(LOCKOUT_KEY),
        SecureStore.deleteItemAsync(ATTEMPTS_KEY),
      ]);
      setLockedUntil(null);
      setFailedAttempts(0);
    }

    try {
      const storedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);
      const inputHash  = await hashPin(pin);

      if (storedHash === inputHash) {
        await SecureStore.deleteItemAsync(ATTEMPTS_KEY).catch(() => {});
        setFailedAttempts(0);
        setLockedUntil(null);
        setIsAuthenticated(true);
        return { valid: true, locked: false, remainingAttempts: MAX_ATTEMPTS, lockoutSeconds: 0 };
      }

      // Wrong PIN — track attempts
      const prevStr  = await SecureStore.getItemAsync(ATTEMPTS_KEY);
      const newCount = parseInt(prevStr ?? '0', 10) + 1;

      if (newCount >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_MS;
        await Promise.all([
          SecureStore.setItemAsync(LOCKOUT_KEY, lockTime.toString()),
          SecureStore.deleteItemAsync(ATTEMPTS_KEY),
        ]);
        setLockedUntil(lockTime);
        setFailedAttempts(0);
        return { valid: false, locked: true, remainingAttempts: 0, lockoutSeconds: LOCKOUT_MS / 1000 };
      }

      await SecureStore.setItemAsync(ATTEMPTS_KEY, newCount.toString());
      setFailedAttempts(newCount);
      return {
        valid: false, locked: false,
        remainingAttempts: MAX_ATTEMPTS - newCount,
        lockoutSeconds: 0,
      };
    } catch {
      return { valid: false, locked: false, remainingAttempts: MAX_ATTEMPTS, lockoutSeconds: 0 };
    }
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isLoading, hasPin,
      biometricsAvailable, biometricsType,
      lockedUntil, failedAttempts,
      setupPin, verifyPin, authenticateWithBiometrics, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
