import {
  Account,
  Category,
  Transaction,
  FinancialGoal,
  IdentityAlert,
  PortfolioData,
  Lesson,
  ConnectedInstitution,
} from '../types';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Chase Checking', type: 'checking', balance: 4280.55, institution: 'Chase', color: '#3D9EFF', accountNumberMask: '••• 4821' },
  { id: '2', name: 'High Yield Savings', type: 'savings', balance: 12450.00, institution: 'Chase', color: '#2ECC71', accountNumberMask: '••• 9912' },
  { id: '3', name: 'Venture X Credit', type: 'credit', balance: -1850.22, institution: 'Capital One', color: '#FF9A3C', accountNumberMask: '••• 3410' },
  { id: '4', name: '401(k) Retirement', type: 'investment', balance: 38000.00, institution: 'Fidelity', color: '#F5C842', accountNumberMask: '••• 7731' },
];

export const INITIAL_INSTITUTIONS: ConnectedInstitution[] = [
  { id: 'inst-1', institution_name: 'Chase Bank', last_synced_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(), accounts_count: 2 },
  { id: 'inst-2', institution_name: 'Capital One', last_synced_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), accounts_count: 1 },
  { id: 'inst-3', institution_name: 'Fidelity Investments', last_synced_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), accounts_count: 1 },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Housing', color: '#3D9EFF', spent: 1450, budget: 1500, icon: 'Home' },
  { id: '2', name: 'Food & Dining', color: '#FF6B6B', spent: 680, budget: 500, icon: 'Utensils' },
  { id: '3', name: 'Transport', color: '#F5C842', spent: 320, budget: 400, icon: 'Car' },
  { id: '4', name: 'Entertainment', color: '#A78BFA', spent: 210, budget: 150, icon: 'Film' },
  { id: '5', name: 'Savings & Growth', color: '#2ECC71', spent: 500, budget: 500, icon: 'PiggyBank' },
  { id: '6', name: 'Health & Wellness', color: '#26C6DA', spent: 95, budget: 200, icon: 'Heart' },
  { id: '7', name: 'Shopping & Retail', color: '#FF9A3C', spent: 430, budget: 300, icon: 'ShoppingBag' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', merchant: 'Starbucks', category: 'Food & Dining', amount: 7.45, date: '2026-07-18', account: 'Venture X Credit' },
  { id: 't2', merchant: 'Starbucks', category: 'Food & Dining', amount: 8.20, date: '2026-07-17', account: 'Venture X Credit' },
  { id: 't3', merchant: 'Starbucks', category: 'Food & Dining', amount: 6.95, date: '2026-07-16', account: 'Venture X Credit' },
  { id: 't4', merchant: 'Netflix', category: 'Entertainment', amount: 22.99, date: '2026-07-15', account: 'Chase Checking', flagged: true },
  { id: 't5', merchant: 'Whole Foods Market', category: 'Food & Dining', amount: 124.50, date: '2026-07-14', account: 'Chase Checking' },
  { id: 't6', merchant: 'Shell Gas Station', category: 'Transport', amount: 68.00, date: '2026-07-13', account: 'Venture X Credit' },
  { id: 't7', merchant: 'Amazon Marketplace', category: 'Shopping & Retail', amount: 89.99, date: '2026-07-12', account: 'Venture X Credit' },
  { id: 't8', merchant: 'Apartment Monthly Rent', category: 'Housing', amount: 1450.00, date: '2026-07-01', account: 'Chase Checking' },
  { id: 't9', merchant: 'Fidelity 401(k) Transfer', category: 'Savings & Growth', amount: 500.00, date: '2026-07-01', account: 'Chase Checking' },
  { id: 't10', merchant: 'Chipotle Mexican Grill', category: 'Food & Dining', amount: 13.75, date: '2026-07-11', account: 'Venture X Credit' },
  { id: 't11', merchant: 'Uber Ride', category: 'Transport', amount: 18.40, date: '2026-07-10', account: 'Chase Checking' },
  { id: 't12', merchant: 'Target Store', category: 'Shopping & Retail', amount: 67.23, date: '2026-07-09', account: 'Venture X Credit' },
  { id: 't13', merchant: 'Unknown Online Merchant', category: 'Shopping & Retail', amount: 199.00, date: '2026-07-08', account: 'Venture X Credit', flagged: true },
];

export const INITIAL_GOALS: FinancialGoal[] = [
  { id: 'g1', title: 'Emergency Fund', target: 15000, current: 12450, deadline: '2026-12-31', color: '#2ECC71', icon: 'Shield' },
  { id: 'g2', title: 'New Car Down Payment', target: 8000, current: 2100, deadline: '2027-06-01', color: '#F5C842', icon: 'Car' },
  { id: 'g3', title: 'Japan Vacation Fund', target: 3000, current: 750, deadline: '2026-11-01', color: '#3D9EFF', icon: 'Plane' },
  { id: 'g4', title: 'Pay Off Credit Card', target: 1850, current: 900, deadline: '2026-10-01', color: '#FF4D6A', icon: 'CreditCard' },
];

export const INITIAL_ALERTS: IdentityAlert[] = [
  {
    id: 'a1',
    type: 'price_increase',
    title: 'Netflix price increased',
    description: 'Your Netflix subscription increased from $15.99 to $22.99/mo this billing cycle.',
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
    description: 'A charge of $199.00 from an unverified merchant appeared on your Venture X Credit card.',
    severity: 'high',
    date: '2026-07-08',
    merchant: 'Unknown Online Merchant',
    amount: 199.00,
    read: false,
  },
  {
    id: 'a3',
    type: 'unusual',
    title: 'Coffee spending insight',
    description: "You have spent $612 at Starbucks over the past 60 days. Redirecting 50% could accelerate your car down payment by 3 months.",
    severity: 'medium',
    date: '2026-07-18',
    merchant: 'Starbucks',
    amount: 612,
    read: false,
  },
];

export const INITIAL_PORTFOLIO: PortfolioData = {
  totalValue: 38000,
  dayChange: 142.50,
  dayChangePercent: 0.38,
  holdings: [
    { id: 'h1', name: 'S&P 500 Index Fund', ticker: 'FXAIX', value: 22000, allocation: 57.9, change: 0.45 },
    { id: 'h2', name: 'Total Bond Market', ticker: 'FXNAX', value: 8000, allocation: 21.1, change: -0.12 },
    { id: 'h3', name: 'International Equities', ticker: 'FSPSX', value: 5000, allocation: 13.2, change: 0.31 },
    { id: 'h4', name: 'Small Cap Growth', ticker: 'FSSNX', value: 3000, allocation: 7.9, change: 0.88 },
  ],
};

export const LESSONS_DATA: Lesson[] = [
  {
    id: 'l1',
    title: 'The 50/30/20 Rule',
    category: 'Budgeting',
    duration: '3 min read',
    icon: 'PieChart',
    color: '#3D9EFF',
    content: '50% of your net income goes to essentials/needs (rent, groceries, basic utilities, transport), 30% to discretionary wants (dining out, entertainment, hobbies), and 20% directly to savings, investments, and accelerated debt payoff. This balanced allocation prevents burnout while building long-term wealth.',
    tip: 'Review your Mind Map bubbles monthly: if any non-essential bubble dwarfs your savings bubble, rebalance immediately.',
  },
  {
    id: 'l2',
    title: 'Emergency Fund Architecture',
    category: 'Saving',
    duration: '4 min read',
    icon: 'Shield',
    color: '#2ECC71',
    content: 'An emergency fund is 3–6 months of essential baseline living expenses parked in a liquid High-Yield Savings Account (HYSA). It acts as your financial fortress against unexpected medical bills, car repairs, or layoffs without relying on high-interest credit card debt.',
    tip: 'Target an initial $1,000 milestone before aggressively tackling moderate debt.',
  },
  {
    id: 'l3',
    title: 'Decoding Your Credit Score',
    category: 'Credit',
    duration: '5 min read',
    icon: 'CreditCard',
    color: '#F5C842',
    content: 'FICO credit scores range from 300 to 850 and are weighted by: Payment History (35%), Credit Utilization (30%), Length of Credit History (15%), Credit Mix (10%), and New Inquiries (10%). Keeping your statement balance under 10–30% of total credit limit yields the fastest score boost.',
    tip: 'Set up auto-pay for at least the minimum balance across all credit lines so you never miss a 30-day reporting window.',
  },
  {
    id: 'l4',
    title: 'Compound Interest & The Rule of 72',
    category: 'Investing',
    duration: '4 min read',
    icon: 'TrendingUp',
    color: '#A78BFA',
    content: 'Compound interest allows returns on initial principal plus accumulated past returns. $1,000 invested at 7% annual real return doubles in approximately 10 years (72 ÷ 7 ≈ 10.3 years). In 30 years, that single $1,000 grows to ~$7,612 without adding another cent.',
    tip: 'Time in the market beats timing the market. Start compounding as early as possible.',
  },
  {
    id: 'l5',
    title: 'Detecting Subscription Creep',
    category: 'Awareness',
    duration: '3 min read',
    icon: 'Bell',
    color: '#FF9A3C',
    content: 'Subscription creep occurs when small recurring monthly micro-charges ($9.99, $14.99) multiply across streaming, cloud storage, fitness, and app services. Providers also implement stealth price hikes over time (e.g. standard streaming plans shifting from $9.99 to $22.99).',
    tip: 'Conduct a quarterly audit. Cancel any recurring service unaccessed in the past 30 days.',
  },
  {
    id: 'l6',
    title: 'The Latte Factor & Intentional Spending',
    category: 'Awareness',
    duration: '2 min read',
    icon: 'Coffee',
    color: '#FF6B6B',
    content: 'A daily $7 premium beverage or food purchase totals $2,555 annually. Invested in an index fund at 7% over 15 years, that represents over $38,000 of wealth. The goal is not deprivation, but making intentional tradeoffs aligned with your true long-term priorities.',
    tip: 'Use your Mind Map visual cues to spotlight which everyday habits represent the highest cumulative leak.',
  },
];

export interface SampleProfileData {
  key: string;
  name: string;
  role: string;
  description: string;
  netWorth: string;
  focus: string;
  accounts: Account[];
  categories: Category[];
  goals: FinancialGoal[];
  portfolio: PortfolioData;
}

export const SAMPLE_PROFILES: Record<string, SampleProfileData> = {
  balanced: {
    key: 'balanced',
    name: 'Alex Mercer',
    role: 'Product Designer (Balanced Wealth)',
    description: 'Steady cashflow with healthy retirement DCA, moderate dining out, and an active vacation fund.',
    netWorth: '$52,880',
    focus: 'Balanced Cashflow & Vacation Fund',
    accounts: [
      { id: '1', name: 'Chase Checking', type: 'checking', balance: 4280.55, institution: 'Chase', color: '#3D9EFF', accountNumberMask: '••• 4821' },
      { id: '2', name: 'High Yield Savings', type: 'savings', balance: 12450.00, institution: 'Chase', color: '#2ECC71', accountNumberMask: '••• 9912' },
      { id: '3', name: 'Venture X Credit', type: 'credit', balance: -1850.22, institution: 'Capital One', color: '#FF9A3C', accountNumberMask: '••• 3410' },
      { id: '4', name: '401(k) Retirement', type: 'investment', balance: 38000.00, institution: 'Fidelity', color: '#F5C842', accountNumberMask: '••• 7731' },
    ],
    categories: [
      { id: '1', name: 'Housing', color: '#3D9EFF', spent: 1450, budget: 1500, icon: 'Home' },
      { id: '2', name: 'Food & Dining', color: '#FF6B6B', spent: 680, budget: 500, icon: 'Utensils' },
      { id: '3', name: 'Transport', color: '#F5C842', spent: 320, budget: 400, icon: 'Car' },
      { id: '4', name: 'Entertainment', color: '#A78BFA', spent: 210, budget: 150, icon: 'Film' },
      { id: '5', name: 'Savings & Growth', color: '#2ECC71', spent: 500, budget: 500, icon: 'PiggyBank' },
      { id: '6', name: 'Health & Wellness', color: '#26C6DA', spent: 95, budget: 200, icon: 'Heart' },
      { id: '7', name: 'Shopping & Retail', color: '#FF9A3C', spent: 430, budget: 300, icon: 'ShoppingBag' },
    ],
    goals: [
      { id: 'g1', title: 'Emergency Fund', target: 15000, current: 12450, deadline: '2026-12-31', color: '#2ECC71', icon: 'Shield' },
      { id: 'g2', title: 'New Car Down Payment', target: 8000, current: 2100, deadline: '2027-06-01', color: '#F5C842', icon: 'Car' },
      { id: 'g3', title: 'Japan Vacation Fund', target: 3000, current: 750, deadline: '2026-11-01', color: '#3D9EFF', icon: 'Plane' },
    ],
    portfolio: INITIAL_PORTFOLIO,
  },
  debt_accelerator: {
    key: 'debt_accelerator',
    name: 'Taylor Brooks',
    role: 'Healthcare Associate (Debt Payoff)',
    description: 'Disciplined debt snowball strategy aggressively paying down credit cards while maintaining a $2k emergency fortress.',
    netWorth: '$14,200',
    focus: 'Rapid High-Interest Elimination',
    accounts: [
      { id: '1', name: 'Wells Fargo Checking', type: 'checking', balance: 2150.00, institution: 'Wells Fargo', color: '#3D9EFF', accountNumberMask: '••• 1184' },
      { id: '2', name: 'Emergency HYSA', type: 'savings', balance: 2000.00, institution: 'Marcus', color: '#2ECC71', accountNumberMask: '••• 6502' },
      { id: '3', name: 'High-APR Visa', type: 'credit', balance: -3850.00, institution: 'Citi', color: '#FF4D6A', accountNumberMask: '••• 9012' },
      { id: '4', name: 'Roth IRA', type: 'investment', balance: 13900.00, institution: 'Vanguard', color: '#F5C842', accountNumberMask: '••• 4421' },
    ],
    categories: [
      { id: '1', name: 'Housing', color: '#3D9EFF', spent: 1200, budget: 1200, icon: 'Home' },
      { id: '2', name: 'Food & Dining', color: '#FF6B6B', spent: 340, budget: 350, icon: 'Utensils' },
      { id: '3', name: 'Transport', color: '#F5C842', spent: 220, budget: 250, icon: 'Car' },
      { id: '4', name: 'Debt Snowball Payment', color: '#FF4D6A', spent: 850, budget: 850, icon: 'CreditCard' },
      { id: '5', name: 'Savings & Growth', color: '#2ECC71', spent: 200, budget: 200, icon: 'PiggyBank' },
      { id: '6', name: 'Utilities & Phone', color: '#26C6DA', spent: 180, budget: 200, icon: 'Home' },
    ],
    goals: [
      { id: 'g1', title: 'Zero Credit Card Debt', target: 3850, current: 2400, deadline: '2026-10-31', color: '#FF4D6A', icon: 'CreditCard' },
      { id: 'g2', title: 'Starter $3,000 Cushion', target: 3000, current: 2000, deadline: '2026-12-31', color: '#2ECC71', icon: 'Shield' },
    ],
    portfolio: {
      totalValue: 13900,
      dayChange: 48.20,
      dayChangePercent: 0.35,
      holdings: [
        { id: 'h1', name: 'Vanguard Total Stock (VTI)', ticker: 'VTI', value: 10400, allocation: 74.8, change: 0.52 },
        { id: 'h2', name: 'Vanguard Total Bond (BND)', ticker: 'BND', value: 3500, allocation: 25.2, change: -0.08 },
      ],
    },
  },
  fire_builder: {
    key: 'fire_builder',
    name: 'Jordan Vance',
    role: 'Software Engineer (FIRE Accumulator)',
    description: 'High 65% savings rate allocating capital strictly into low-cost index funds and maxed tax-advantaged accounts.',
    netWorth: '$186,400',
    focus: 'Early Financial Independence (FIRE)',
    accounts: [
      { id: '1', name: 'Schwab Checking', type: 'checking', balance: 5100.00, institution: 'Charles Schwab', color: '#3D9EFF', accountNumberMask: '••• 8201' },
      { id: '2', name: 'Ally HYSA (Runway)', type: 'savings', balance: 25000.00, institution: 'Ally Bank', color: '#2ECC71', accountNumberMask: '••• 3319' },
      { id: '3', name: 'Fidelity Brokerage', type: 'investment', balance: 94300.00, institution: 'Fidelity', color: '#FDE047', accountNumberMask: '••• 6092' },
      { id: '4', name: 'Maxed 401(k) + HSA', type: 'investment', balance: 62000.00, institution: 'Fidelity', color: '#2ECC71', accountNumberMask: '••• 1488' },
    ],
    categories: [
      { id: '1', name: 'Housing', color: '#3D9EFF', spent: 1650, budget: 1700, icon: 'Home' },
      { id: '2', name: 'Food & Groceries', color: '#FF6B6B', spent: 420, budget: 450, icon: 'Utensils' },
      { id: '3', name: 'Transport & EV', color: '#F5C842', spent: 180, budget: 200, icon: 'Car' },
      { id: '4', name: 'Monthly Index Fund DCA', color: '#2ECC71', spent: 3400, budget: 3500, icon: 'PiggyBank' },
      { id: '5', name: 'Health & Wellness', color: '#26C6DA', spent: 140, budget: 150, icon: 'Heart' },
      { id: '6', name: 'Hobbies & Gear', color: '#A78BFA', spent: 220, budget: 250, icon: 'Film' },
    ],
    goals: [
      { id: 'g1', title: 'Reach $250k Milestone', target: 250000, current: 186400, deadline: '2027-06-30', color: '#2ECC71', icon: 'TrendingUp' },
      { id: 'g2', title: '12-Month Liquid Fortress', target: 30000, current: 25000, deadline: '2026-11-30', color: '#3D9EFF', icon: 'Shield' },
    ],
    portfolio: {
      totalValue: 156300,
      dayChange: 685.40,
      dayChangePercent: 0.44,
      holdings: [
        { id: 'h1', name: 'Vanguard Total World (VT)', ticker: 'VT', value: 92000, allocation: 58.8, change: 0.61 },
        { id: 'h2', name: 'S&P 500 Index (FXAIX)', ticker: 'FXAIX', value: 48000, allocation: 30.7, change: 0.42 },
        { id: 'h3', name: 'US Treasury Bonds (GOVT)', ticker: 'GOVT', value: 16300, allocation: 10.5, change: -0.05 },
      ],
    },
  },
};
