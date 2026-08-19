export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  account: string;
  flagged?: boolean;
  pending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  spent: number;
  budget: number;
  icon: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  institution: string;
  color: string;
  accountNumberMask?: string;
}

export interface IdentityAlert {
  id: string;
  type: 'unusual' | 'price_increase' | 'new_charge' | 'location';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  merchant?: string;
  amount?: number;
  read: boolean;
}

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  value: number;
  allocation: number;
  change: number;
}

export interface PortfolioData {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: Holding[];
}

export interface ConnectedInstitution {
  id: string;
  institution_name: string;
  last_synced_at: string;
  accounts_count: number;
  logo?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: 'Budgeting' | 'Saving' | 'Credit' | 'Investing' | 'Awareness';
  duration: string;
  icon: string;
  color: string;
  content: string;
  tip: string;
}

export type NavigationTab = 'cover' | 'mindmap' | 'dashboard' | 'goals' | 'portfolio' | 'learn';

export type SampleProfileKey = 'balanced' | 'debt_accelerator' | 'fire_builder';

export interface CopilotStep {
  id: number;
  title: string;
  shortDesc: string;
  details: string;
  actionText: string;
  targetTab: NavigationTab;
  highlightSelector?: string;
  tip: string;
}
