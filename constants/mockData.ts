import { Colors } from './theme';

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  account: string;
  flagged?: boolean;
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
  type: string;
  balance: number;
  institution: string;
  color: string;
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

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Chase Checking', type: 'checking', balance: 4280.55, institution: 'Chase', color: Colors.primary },
  { id: '2', name: 'Savings Account', type: 'savings', balance: 12450.00, institution: 'Chase', color: Colors.success },
  { id: '3', name: 'Visa Credit', type: 'credit', balance: -1850.22, institution: 'Capital One', color: Colors.warning },
  { id: '4', name: '401(k)', type: 'investment', balance: 38000.00, institution: 'Fidelity', color: Colors.gold },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Housing', color: Colors.nodeHousing, spent: 1450, budget: 1500, icon: 'home' },
  { id: '2', name: 'Food', color: Colors.nodeFood, spent: 680, budget: 500, icon: 'restaurant' },
  { id: '3', name: 'Transport', color: Colors.nodeTransport, spent: 320, budget: 400, icon: 'directions-car' },
  { id: '4', name: 'Entertainment', color: Colors.nodeEntertainment, spent: 210, budget: 150, icon: 'movie' },
  { id: '5', name: 'Savings', color: Colors.nodeSavings, spent: 500, budget: 500, icon: 'savings' },
  { id: '6', name: 'Health', color: Colors.nodeHealth, spent: 95, budget: 200, icon: 'favorite' },
  { id: '7', name: 'Shopping', color: Colors.nodeShopping, spent: 430, budget: 300, icon: 'shopping-bag' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', merchant: 'Starbucks', category: 'Food', amount: 7.45, date: '2026-07-18', account: 'Visa Credit' },
  { id: 't2', merchant: 'Starbucks', category: 'Food', amount: 8.20, date: '2026-07-17', account: 'Visa Credit' },
  { id: 't3', merchant: 'Starbucks', category: 'Food', amount: 6.95, date: '2026-07-16', account: 'Visa Credit' },
  { id: 't4', merchant: 'Netflix', category: 'Entertainment', amount: 22.99, date: '2026-07-15', account: 'Chase Checking', flagged: true },
  { id: 't5', merchant: 'Whole Foods', category: 'Food', amount: 124.50, date: '2026-07-14', account: 'Chase Checking' },
  { id: 't6', merchant: 'Shell Gas', category: 'Transport', amount: 68.00, date: '2026-07-13', account: 'Visa Credit' },
  { id: 't7', merchant: 'Amazon', category: 'Shopping', amount: 89.99, date: '2026-07-12', account: 'Visa Credit' },
  { id: 't8', merchant: 'Rent', category: 'Housing', amount: 1450.00, date: '2026-07-01', account: 'Chase Checking' },
  { id: 't9', merchant: 'Fidelity', category: 'Savings', amount: 500.00, date: '2026-07-01', account: 'Chase Checking' },
  { id: 't10', merchant: 'Chipotle', category: 'Food', amount: 13.75, date: '2026-07-11', account: 'Visa Credit' },
  { id: 't11', merchant: 'Uber', category: 'Transport', amount: 18.40, date: '2026-07-10', account: 'Chase Checking' },
  { id: 't12', merchant: 'Target', category: 'Shopping', amount: 67.23, date: '2026-07-09', account: 'Visa Credit' },
  { id: 't13', merchant: 'Unknown Merchant', category: 'Shopping', amount: 199.00, date: '2026-07-08', account: 'Visa Credit', flagged: true },
];

export const MOCK_GOALS: FinancialGoal[] = [
  { id: 'g1', title: 'Emergency Fund', target: 15000, current: 12450, deadline: '2026-12-31', color: Colors.success, icon: 'security' },
  { id: 'g2', title: 'New Car Down Payment', target: 8000, current: 2100, deadline: '2027-06-01', color: Colors.gold, icon: 'directions-car' },
  { id: 'g3', title: 'Vacation Fund', target: 3000, current: 750, deadline: '2026-11-01', color: Colors.primary, icon: 'flight' },
  { id: 'g4', title: 'Pay Off Credit Card', target: 1850, current: 900, deadline: '2026-10-01', color: Colors.danger, icon: 'credit-card' },
];

export const MOCK_ALERTS: IdentityAlert[] = [
  {
    id: 'a1',
    type: 'price_increase',
    title: 'Netflix price increased',
    description: 'Your Netflix subscription went up from $15.99 to $22.99 this month.',
    severity: 'low',
    date: '2026-07-15',
    merchant: 'Netflix',
    amount: 22.99,
    read: false,
  },
  {
    id: 'a2',
    type: 'unusual',
    title: 'Unusual charge detected',
    description: 'A charge of $199.00 from an unknown merchant appeared on your Visa Credit card.',
    severity: 'high',
    date: '2026-07-08',
    merchant: 'Unknown Merchant',
    amount: 199.00,
    read: false,
  },
  {
    id: 'a3',
    type: 'unusual',
    title: 'Coffee spending insight',
    description: "You've spent $612 at Starbucks over the past 2 months. That's $612 you could redirect toward your car down payment.",
    severity: 'medium',
    date: '2026-07-18',
    merchant: 'Starbucks',
    amount: 612,
    read: false,
  },
];

export const MOCK_PORTFOLIO = {
  totalValue: 38000,
  dayChange: 142.50,
  dayChangePercent: 0.38,
  holdings: [
    { id: 'h1', name: 'S&P 500 Index', ticker: 'FXAIX', value: 22000, allocation: 57.9, change: 0.45 },
    { id: 'h2', name: 'Total Bond Market', ticker: 'FXNAX', value: 8000, allocation: 21.1, change: -0.12 },
    { id: 'h3', name: 'International', ticker: 'FSPSX', value: 5000, allocation: 13.2, change: 0.31 },
    { id: 'h4', name: 'Small Cap', ticker: 'FSSNX', value: 3000, allocation: 7.9, change: 0.88 },
  ],
};
