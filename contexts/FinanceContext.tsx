import React, { createContext, useState, ReactNode } from 'react';
import {
  MOCK_ACCOUNTS,
  MOCK_CATEGORIES,
  MOCK_TRANSACTIONS,
  MOCK_GOALS,
  MOCK_ALERTS,
  MOCK_PORTFOLIO,
  Account,
  Category,
  Transaction,
  FinancialGoal,
  IdentityAlert,
} from '@/constants/mockData';

interface FinanceContextType {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  goals: FinancialGoal[];
  alerts: IdentityAlert[];
  portfolio: typeof MOCK_PORTFOLIO;
  unreadAlerts: number;
  markAlertRead: (id: string) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  totalNetWorth: number;
  monthlyIncome: number;
  monthlySpend: number;
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [accounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<FinancialGoal[]>(MOCK_GOALS);
  const [alerts, setAlerts] = useState<IdentityAlert[]>(MOCK_ALERTS);
  const [portfolio] = useState(MOCK_PORTFOLIO);

  const addGoal = (newGoal: Omit<FinancialGoal, 'id'>) => {
    setGoals(prev => [...prev, { ...newGoal, id: `g${Date.now()}` }]);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = 5800;
  const monthlySpend = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <FinanceContext.Provider value={{
      accounts,
      categories,
      transactions,
      goals,
      alerts,
      portfolio,
      unreadAlerts,
      markAlertRead,
      addGoal,
      totalNetWorth,
      monthlyIncome,
      monthlySpend,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}
