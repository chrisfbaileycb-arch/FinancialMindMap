import { useContext } from 'react';
import { BackendFinanceContext } from '@/contexts/BackendFinanceContext';

export function useBackendFinanceContext() {
  const ctx = useContext(BackendFinanceContext);
  if (!ctx) throw new Error('useBackendFinanceContext must be used within BackendFinanceProvider');
  return ctx;
}
