import { AlertProvider, AuthProvider as SupabaseAuthProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { BackendFinanceProvider } from '@/contexts/BackendFinanceContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SupabaseAuthProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <BackendFinanceProvider>
            <FinanceProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </FinanceProvider>
            </BackendFinanceProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </SupabaseAuthProvider>
    </AlertProvider>
  );
}
