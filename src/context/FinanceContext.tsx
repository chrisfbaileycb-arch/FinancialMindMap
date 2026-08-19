import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Category,
  Transaction,
  FinancialGoal,
  Account,
  IdentityAlert,
  PortfolioData,
  ConnectedInstitution,
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_ALERTS,
  INITIAL_PORTFOLIO,
  INITIAL_INSTITUTIONS,
  SAMPLE_PROFILES,
} from '../data/initialData';

interface FinanceContextType {
  categories: Category[];
  totalMonthlySpend: number;
  totalMonthlyBudget: number;
  accounts: Account[];
  totalBalance: number;
  institutions: ConnectedInstitution[];
  transactions: Transaction[];
  goals: FinancialGoal[];
  alerts: IdentityAlert[];
  unreadAlertCount: number;
  portfolio: PortfolioData;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  isSyncing: boolean;
  activeCategory: string | null;
  activeProfileKey: string;
  isCopilotActive: boolean;
  activeCopilotStep: number;
  highlightedElementId: string | null;
  setIsCopilotActive: (val: boolean) => void;
  setActiveCopilotStep: (step: number) => void;
  triggerHighlight: (elementId: string | null) => void;
  loadSampleProfile: (key: string) => void;
  resetToDefaults: () => void;
  setActiveCategory: (id: string | null) => void;
  toggleAuth: () => void;
  setDemoMode: (val: boolean) => void;
  updateCategoryBudget: (id: string, newBudget: number) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  contributeToGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  dismissAlert: (id: string) => void;
  markAllAlertsRead: () => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  toggleFlagTransaction: (id: string) => void;
  linkInstitution: (name: string, token?: string) => void;
  syncAllAccounts: () => Promise<void>;
  askFinancialInsight: (query: string) => Promise<string>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeProfileKey, setActiveProfileKey] = useState<string>('balanced');
  const [isCopilotActive, setIsCopilotActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('fmm_copilot_active');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeCopilotStep, setActiveCopilotStep] = useState<number>(0);
  const [highlightedElementId, setHighlightedElementId] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fmm_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('fmm_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [institutions, setInstitutions] = useState<ConnectedInstitution[]>(() => {
    const saved = localStorage.getItem('fmm_institutions');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fmm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('fmm_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [alerts, setAlerts] = useState<IdentityAlert[]>(() => {
    const saved = localStorage.getItem('fmm_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [portfolio, setPortfolio] = useState<PortfolioData>(INITIAL_PORTFOLIO);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('fmm_copilot_active', JSON.stringify(isCopilotActive));
  }, [isCopilotActive]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fmm_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fmm_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('fmm_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('fmm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fmm_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fmm_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Derived Totals
  const totalMonthlySpend = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.spent, 0);
  }, [categories]);

  const totalMonthlyBudget = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.budget, 0);
  }, [categories]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, a) => sum + a.balance, 0);
  }, [accounts]);

  const unreadAlertCount = useMemo(() => {
    return alerts.filter(a => !a.read).length;
  }, [alerts]);

  const toggleAuth = () => {
    setIsAuthenticated(prev => !prev);
  };

  const setDemoMode = (val: boolean) => {
    setIsDemoMode(val);
  };

  const updateCategoryBudget = (id: string, newBudget: number) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, budget: Math.max(1, newBudget) } : cat))
    );
  };

  const addGoal = (goalData: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: `g_${Date.now()}`,
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const contributeToGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const updatedCurrent = Math.min(g.target, g.current + amount);
          return { ...g, current: updatedCurrent };
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `t_${Date.now()}`,
    };
    setTransactions(prev => [newTx, ...prev]);

    // Also update matching category spent
    setCategories(prev =>
      prev.map(cat => {
        if (cat.name.toLowerCase() === txData.category.toLowerCase() || txData.category.toLowerCase().includes(cat.name.toLowerCase())) {
          return { ...cat, spent: cat.spent + txData.amount };
        }
        return cat;
      })
    );
  };

  const toggleFlagTransaction = (id: string) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, flagged: !tx.flagged } : tx))
    );
  };

  const linkInstitution = (name: string, _token?: string) => {
    const newInst: ConnectedInstitution = {
      id: `inst_${Date.now()}`,
      institution_name: name,
      last_synced_at: new Date().toISOString(),
      accounts_count: 1,
    };
    setInstitutions(prev => [newInst, ...prev]);

    // Create a corresponding account
    const newAcc: Account = {
      id: `acc_${Date.now()}`,
      name: `${name} Checking`,
      type: 'checking',
      balance: Math.floor(Math.random() * 4000) + 1200,
      institution: name,
      color: '#3D9EFF',
      accountNumberMask: `••• ${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setAccounts(prev => [...prev, newAcc]);
  };

  const syncAllAccounts = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1400));
    setInstitutions(prev =>
      prev.map(inst => ({
        ...inst,
        last_synced_at: new Date().toISOString(),
      }))
    );
    setIsSyncing(false);
  };

  const askFinancialInsight = async (query: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const q = query.toLowerCase();
    const foodCat = categories.find(c => c.name.toLowerCase().includes('food'));
    const entertainmentCat = categories.find(c => c.name.toLowerCase().includes('entertainment'));
    const shoppingCat = categories.find(c => c.name.toLowerCase().includes('shopping'));

    if (q.includes('dining') || q.includes('food') || q.includes('restaurant') || q.includes('coffee') || q.includes('starbucks')) {
      const foodSpent = foodCat?.spent || 680;
      const foodBudget = foodCat?.budget || 500;
      const over = foodSpent - foodBudget;
      return `🍽️ **Dining & Food Analysis:** You have spent **$${foodSpent.toLocaleString()}** this month against a $${foodBudget.toLocaleString()} budget (${over > 0 ? `**$${over} over budget**` : 'within budget'}). Starbucks alone accounts for significant recurring spending ($612 over 60 days). Capping dining out to twice weekly could save you **$240/month**, easily funding your Japan Vacation or Car Down Payment goals.`;
    }

    if (q.includes('biggest') || q.includes('expense') || q.includes('highest') || q.includes('category')) {
      const sorted = [...categories].sort((a, b) => b.spent - a.spent);
      const top = sorted[0];
      const second = sorted[1];
      return `📊 **Largest Outflows:** Your single highest expense is **${top.name}** at **$${top.spent.toLocaleString()}** (${((top.spent / totalMonthlySpend) * 100).toFixed(1)}% of total monthly spend). Your second highest category is **${second.name}** at **$${second.spent.toLocaleString()}**. Look at trimming non-fixed items first for maximum immediate cash flow impact.`;
    }

    if (q.includes('save') || q.includes('leak') || q.includes('cut') || q.includes('reduce')) {
      return `💡 **Top Savings Opportunities:**
1. **Dining & Coffee**: Trimming Starbucks & takeout could free up **~$220/month**.
2. **Entertainment & Streaming**: Subscription audit can reclaim **$35/month** in unused services.
3. **Shopping & Discretionary**: Implementing a 48-hour delay rule for non-essential online carts could save **~$150/month**.
Total potential savings: **$405/month ($4,860/year)**.`;
    }

    if (q.includes('track') || q.includes('budget') || q.includes('progress') || q.includes('status')) {
      const pct = ((totalMonthlySpend / totalMonthlyBudget) * 100).toFixed(1);
      return `📈 **Budget Status Overview:** You have spent **$${totalMonthlySpend.toLocaleString()}** out of your **$${totalMonthlyBudget.toLocaleString()}** monthly budget (**${pct}% utilization**). You are currently **$${Math.abs(totalMonthlySpend - totalMonthlyBudget).toLocaleString()} ${totalMonthlySpend > totalMonthlyBudget ? 'over overall limit' : 'under total budget'}**. Categories needing attention: Food & Dining and Shopping.`;
    }

    if (q.includes('goal') || q.includes('emergency') || q.includes('vacation') || q.includes('car')) {
      return `🎯 **Goals Check:** Your Emergency Fund is **83% funded** ($12,450 / $15,000)—you are on track to complete it in 3 months. Redirecting $200/mo from discretionary spending will shorten your New Car Down Payment timeline by 4 full months.`;
    }

    // Default high-quality financial assessment
    return `🤖 **Financial Insight Summary:**
- **Monthly Net Cash Flow**: Total spending is $${totalMonthlySpend.toLocaleString()} across ${categories.length} tracked categories.
- **Top Over-Budget Bubble**: Food & Dining is ${foodCat ? `$${foodCat.spent - foodCat.budget} over budget` : '$180 over'}.
- **Net Worth Resilience**: With $${totalBalance.toLocaleString()} across linked accounts and $12,450 in cash reserves, your liquid runway is solid (~3.3 months).
- **Recommended Action**: Automate $250 bi-weekly transfers to your Emergency Fund and set proactive budget alerts for dining.`;
  };

  const triggerHighlight = (elementId: string | null) => {
    setHighlightedElementId(elementId);
    if (elementId) {
      // Auto-clear highlight after 4 seconds
      setTimeout(() => {
        setHighlightedElementId(prev => (prev === elementId ? null : prev));
      }, 4000);
    }
  };

  const loadSampleProfile = (profileKey: string) => {
    const profile = SAMPLE_PROFILES[profileKey];
    if (!profile) return;
    setActiveProfileKey(profileKey);
    setCategories(profile.categories);
    setAccounts(profile.accounts);
    setGoals(profile.goals);
    setPortfolio(profile.portfolio);
  };

  const resetToDefaults = () => {
    setActiveProfileKey('balanced');
    setCategories(INITIAL_CATEGORIES);
    setAccounts(INITIAL_ACCOUNTS);
    setInstitutions(INITIAL_INSTITUTIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setGoals(INITIAL_GOALS);
    setAlerts(INITIAL_ALERTS);
    setPortfolio(INITIAL_PORTFOLIO);
    localStorage.removeItem('fmm_categories');
    localStorage.removeItem('fmm_accounts');
    localStorage.removeItem('fmm_institutions');
    localStorage.removeItem('fmm_transactions');
    localStorage.removeItem('fmm_goals');
    localStorage.removeItem('fmm_alerts');
  };

  return (
    <FinanceContext.Provider
      value={{
        categories,
        totalMonthlySpend,
        totalMonthlyBudget,
        accounts,
        totalBalance,
        institutions,
        transactions,
        goals,
        alerts,
        unreadAlertCount,
        portfolio,
        isDemoMode,
        isAuthenticated,
        isSyncing,
        activeCategory,
        activeProfileKey,
        isCopilotActive,
        activeCopilotStep,
        highlightedElementId,
        setIsCopilotActive,
        setActiveCopilotStep,
        triggerHighlight,
        loadSampleProfile,
        resetToDefaults,
        setActiveCategory,
        toggleAuth,
        setDemoMode,
        updateCategoryBudget,
        addGoal,
        contributeToGoal,
        deleteGoal,
        dismissAlert,
        markAllAlertsRead,
        addTransaction,
        toggleFlagTransaction,
        linkInstitution,
        syncAllAccounts,
        askFinancialInsight,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinanceContext = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinanceContext must be used within a FinanceProvider');
  }
  return context;
};
