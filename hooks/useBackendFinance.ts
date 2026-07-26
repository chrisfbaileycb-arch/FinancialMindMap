import { useState, useEffect, useCallback } from 'react';
import {
  fetchAccounts, fetchTransactions, fetchAlerts, markAlertRead,
  fetchSpendingProfiles, fetchLinkedInstitutions, syncAll, askFinancialInsight,
} from '@/services/financeService';

export interface BackendAccount {
  id: string;
  name: string;
  type: string;
  subtype: string | null;
  current_balance: number | null;
  available_balance: number | null;
  institution_name: string | null;
  currency_code: string;
}

export interface BackendTransaction {
  id: string;
  merchant_name: string | null;
  amount: number;
  category: string | null;
  date: string;
  pending: boolean;
  flagged: boolean;
}

export interface BackendAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  merchant_name: string | null;
  amount: number | null;
  read: boolean;
  created_at: string;
}

export interface LinkedInstitution {
  id: string;
  institution_name: string;
  last_synced_at: string | null;
  created_at: string;
}

export function useBackendFinance() {
  const [accounts, setAccounts] = useState<BackendAccount[]>([]);
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [alerts, setAlerts] = useState<BackendAlert[]>([]);
  const [institutions, setInstitutions] = useState<LinkedInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insightAnswer, setInsightAnswer] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      setError(null);
      const [accs, txs, als, insts] = await Promise.all([
        fetchAccounts(),
        fetchTransactions(50),
        fetchAlerts(),
        fetchLinkedInstitutions(),
      ]);
      setAccounts(accs);
      setTransactions(txs);
      setAlerts(als);
      setInstitutions(insts);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    // 4-hour polling interval
    const interval = setInterval(loadAll, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadAll]);

  const triggerSync = useCallback(async () => {
    setSyncing(true);
    try {
      await syncAll();
      await loadAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSyncing(false);
    }
  }, [loadAll]);

  const dismissAlert = useCallback(async (id: string) => {
    await markAlertRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const askInsight = useCallback(async (query: string) => {
    setInsightLoading(true);
    setInsightAnswer(null);
    try {
      const answer = await askFinancialInsight(query);
      setInsightAnswer(answer);
    } catch (e: any) {
      setInsightAnswer(`Unable to load insight: ${e.message}`);
    } finally {
      setInsightLoading(false);
    }
  }, []);

  const unreadAlertCount = alerts.filter(a => !a.read).length;
  const totalBalance = accounts.reduce((s, a) => s + (a.current_balance ?? 0), 0);
  const monthlySpend = transactions
    .filter(t => {
      const d = new Date(t.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && !t.pending;
    })
    .reduce((s, t) => s + t.amount, 0);

  return {
    accounts, transactions, alerts, institutions,
    loading, syncing, error,
    insightAnswer, insightLoading,
    unreadAlertCount, totalBalance, monthlySpend,
    triggerSync, dismissAlert, askInsight, reload: loadAll,
  };
}
