import React, { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import {
  fetchAccounts, fetchTransactions, fetchAlerts, markAlertRead,
  fetchLinkedInstitutions, syncAll, askFinancialInsight,
} from '@/services/financeService';
import { Colors } from '@/constants/theme';
import { MOCK_CATEGORIES, Category } from '@/constants/mockData';

// ── Types ──────────────────────────────────────────────────────────────────

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

// Normalised category node for Mind Map — derived from real or mock data
export interface MapCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  spent: number;
  budget: number;
  isReal: boolean; // true = derived from Plaid transactions
}

// ── Category aggregation ───────────────────────────────────────────────────

// Map Plaid category strings → display names, colors, icons
const CATEGORY_META: Record<string, { name: string; color: string; icon: string; defaultBudget: number }> = {
  'food and drink':    { name: 'Food & Drink',   color: Colors.nodeFood,          icon: 'restaurant',     defaultBudget: 600 },
  food:                { name: 'Food & Drink',   color: Colors.nodeFood,          icon: 'restaurant',     defaultBudget: 600 },
  restaurants:         { name: 'Food & Drink',   color: Colors.nodeFood,          icon: 'restaurant',     defaultBudget: 600 },
  groceries:           { name: 'Groceries',      color: Colors.nodeFood,          icon: 'shopping-cart',  defaultBudget: 500 },
  travel:              { name: 'Transport',       color: Colors.nodeTransport,     icon: 'directions-car', defaultBudget: 400 },
  transportation:      { name: 'Transport',       color: Colors.nodeTransport,     icon: 'directions-car', defaultBudget: 400 },
  transfer:            { name: 'Savings',         color: Colors.nodeSavings,       icon: 'savings',        defaultBudget: 500 },
  entertainment:       { name: 'Entertainment',  color: Colors.nodeEntertainment, icon: 'movie',          defaultBudget: 200 },
  recreation:          { name: 'Entertainment',  color: Colors.nodeEntertainment, icon: 'movie',          defaultBudget: 200 },
  'service and utilities': { name: 'Utilities',  color: Colors.nodeHousing,       icon: 'bolt',           defaultBudget: 300 },
  utilities:           { name: 'Utilities',      color: Colors.nodeHousing,       icon: 'bolt',           defaultBudget: 300 },
  rent:                { name: 'Housing',         color: Colors.nodeHousing,       icon: 'home',           defaultBudget: 1500 },
  'payment and fees':  { name: 'Payments',       color: Colors.warning,           icon: 'payment',        defaultBudget: 300 },
  payment:             { name: 'Payments',       color: Colors.warning,           icon: 'payment',        defaultBudget: 300 },
  'personal care':     { name: 'Health',          color: Colors.nodeHealth,        icon: 'favorite',       defaultBudget: 150 },
  health:              { name: 'Health',          color: Colors.nodeHealth,        icon: 'favorite',       defaultBudget: 150 },
  medical:             { name: 'Health',          color: Colors.nodeHealth,        icon: 'local-hospital', defaultBudget: 150 },
  shopping:            { name: 'Shopping',        color: Colors.nodeShopping,      icon: 'shopping-bag',   defaultBudget: 300 },
  subscription:        { name: 'Subscriptions',  color: Colors.nodeEntertainment, icon: 'subscriptions',  defaultBudget: 100 },
};

function normaliseCategoryKey(raw: string): string {
  return raw.trim().toLowerCase();
}

function metaForCategory(raw: string) {
  const key = normaliseCategoryKey(raw);
  if (CATEGORY_META[key]) return CATEGORY_META[key];
  // Partial match
  for (const [k, meta] of Object.entries(CATEGORY_META)) {
    if (key.includes(k) || k.includes(key)) return meta;
  }
  return null;
}

// Aggregate transactions into MapCategory nodes (current calendar month only)
function aggregateToCategories(transactions: BackendTransaction[]): MapCategory[] {
  const now = new Date();
  const currentMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && !t.pending;
  });

  const totals: Record<string, { amount: number; meta: ReturnType<typeof metaForCategory> }> = {};

  for (const tx of currentMonth) {
    if (!tx.category) continue;
    const meta = metaForCategory(tx.category);
    const displayName = meta ? meta.name : tx.category;
    const key = displayName.toLowerCase();
    if (!totals[key]) totals[key] = { amount: 0, meta };
    totals[key].amount += tx.amount;
  }

  return Object.entries(totals)
    .filter(([, { amount }]) => amount > 0)
    .map(([key, { amount, meta }], i) => {
      const fallbackColors = [
        Colors.primary, Colors.gold, Colors.nodeFood, Colors.nodeTransport,
        Colors.nodeHealth, Colors.nodeSavings, Colors.nodeShopping, Colors.nodeEntertainment,
      ];
      const fallbackIcons = ['attach-money', 'credit-card', 'receipt', 'shopping-bag'];
      const displayName = meta ? meta.name : key.charAt(0).toUpperCase() + key.slice(1);
      return {
        id: `real-${key}`,
        name: displayName,
        color: meta ? meta.color : fallbackColors[i % fallbackColors.length],
        icon: meta ? meta.icon : fallbackIcons[i % fallbackIcons.length],
        spent: Math.round(amount * 100) / 100,
        budget: meta ? meta.defaultBudget : Math.round(amount * 1.2),
        isReal: true,
      };
    })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 10); // cap at 10 nodes for readability
}

// ── Context type ───────────────────────────────────────────────────────────

interface BackendFinanceContextType {
  // Raw backend data
  accounts: BackendAccount[];
  transactions: BackendTransaction[];
  alerts: BackendAlert[];
  institutions: LinkedInstitution[];

  // Derived / computed
  loading: boolean;
  syncing: boolean;
  error: string | null;
  unreadAlertCount: number;
  totalBalance: number;
  monthlySpend: number;

  // Mind Map categories — real when bank linked, mock fallback otherwise
  mapCategories: MapCategory[];
  hasRealData: boolean;

  // AI Insight
  insightAnswer: string | null;
  insightLoading: boolean;
  askInsight: (q: string) => void;

  // Actions
  triggerSync: () => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

// ── Context ────────────────────────────────────────────────────────────────

export const BackendFinanceContext = createContext<BackendFinanceContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────

export function BackendFinanceProvider({ children }: { children: ReactNode }) {
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
        fetchTransactions(200), // fetch more for category aggregation
        fetchAlerts(),
        fetchLinkedInstitutions(),
      ]);
      setAccounts(accs);
      setTransactions(txs);
      setAlerts(als);
      setInstitutions(insts);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadAll]);

  const triggerSync = useCallback(async () => {
    setSyncing(true);
    try {
      await syncAll();
      await loadAll();
    } catch (e: any) {
      setError(e.message ?? 'Sync failed');
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

  // Derived values
  const unreadAlertCount = alerts.filter(a => !a.read).length;
  const totalBalance = accounts.reduce((s, a) => s + (a.current_balance ?? 0), 0);
  const monthlySpend = transactions
    .filter(t => {
      const d = new Date(t.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && !t.pending;
    })
    .reduce((s, t) => s + t.amount, 0);

  // Map categories — real data when available, mock fallback
  const hasRealData = accounts.length > 0;
  const realCategories = hasRealData ? aggregateToCategories(transactions) : [];
  const mapCategories: MapCategory[] = hasRealData && realCategories.length > 0
    ? realCategories
    : MOCK_CATEGORIES.map(c => ({ ...c, isReal: false }));

  return (
    <BackendFinanceContext.Provider value={{
      accounts, transactions, alerts, institutions,
      loading, syncing, error,
      unreadAlertCount, totalBalance, monthlySpend,
      mapCategories, hasRealData,
      insightAnswer, insightLoading, askInsight,
      triggerSync, dismissAlert, reload: loadAll,
    }}>
      {children}
    </BackendFinanceContext.Provider>
  );
}
