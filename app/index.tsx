import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAuth as useSupabaseAuth } from '@/template';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';

export default function AppEntry() {
  const { user, loading: supabaseLoading } = useSupabaseAuth();
  const { isAuthenticated, isLoading: pinLoading, hasPin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (supabaseLoading || pinLoading) return;

    if (!user) {
      // No Supabase session → email/OTP sign-in
      router.replace('/auth?mode=email');
    } else if (!hasPin) {
      // Signed in but no PIN yet → PIN setup
      router.replace('/auth?mode=setup');
    } else if (!isAuthenticated) {
      // Has PIN, not yet unlocked today → PIN/biometric screen
      router.replace('/auth?mode=login');
    } else {
      router.replace('/(tabs)');
    }
  }, [supabaseLoading, pinLoading, !!user, hasPin, isAuthenticated]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
