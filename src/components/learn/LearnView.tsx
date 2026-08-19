import React, { useState } from 'react';
import {
  GraduationCap,
  PieChart,
  Shield,
  CreditCard,
  TrendingUp,
  Bell,
  Coffee,
  Lightbulb,
  Calculator,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
  ArrowRight,
  RotateCcw,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { LESSONS_DATA } from '../../data/initialData';
import { useFinanceContext } from '../../context/FinanceContext';

const getLessonIcon = (iconName: string) => {
  switch (iconName) {
    case 'PieChart':
      return PieChart;
    case 'Shield':
      return Shield;
    case 'CreditCard':
      return CreditCard;
    case 'TrendingUp':
      return TrendingUp;
    case 'Bell':
      return Bell;
    case 'Coffee':
      return Coffee;
    default:
      return BookOpen;
  }
};

export const LearnView: React.FC = () => {
  const { totalMonthlySpend, accounts } = useFinanceContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>('l1');
  const [activeCalcTab, setActiveCalcTab] = useState<'compound' | 'runway' | 'debt' | 'habit' | 'fiftythirty'>('compound');

  // Calculator 1: Rule of 72 & Compound Interest Engine
  const [calcPrincipal, setCalcPrincipal] = useState<number>(5000);
  const [calcMonthlyDep, setCalcMonthlyDep] = useState<number>(300);
  const [calcReturnRate, setCalcReturnRate] = useState<number>(8);
  const [calcYears, setCalcYears] = useState<number>(15);

  // Calculator 2: Emergency Runway Fortress
  const [calcMonthlyBurn, setCalcMonthlyBurn] = useState<number>(totalMonthlySpend || 3200);
  const [calcLiquidReserves, setCalcLiquidReserves] = useState<number>(12450);

  // Calculator 3: Debt Snowball Accelerator
  const [calcDebtBalance, setCalcDebtBalance] = useState<number>(3850);
  const [calcDebtApr, setCalcDebtApr] = useState<number>(22.99);
  const [calcDebtMinPay, setCalcDebtMinPay] = useState<number>(120);
  const [calcDebtExtraPay, setCalcDebtExtraPay] = useState<number>(150);

  // Calculator 4: Daily Habit Opportunity Cost
  const [calcDailySpend, setCalcDailySpend] = useState<number>(7);
  const [calcHabitYears, setCalcHabitYears] = useState<number>(10);

  // Calculator 5: 50/30/20 Allocator
  const [calcMonthlyIncome, setCalcMonthlyIncome] = useState<number>(5500);

  const categories = ['All', 'Budgeting', 'Saving', 'Credit', 'Investing', 'Awareness'];

  const filteredLessons = selectedCategory === 'All'
    ? LESSONS_DATA
    : LESSONS_DATA.filter(l => l.category === selectedCategory);

  // Computations for Rule of 72 & Compound
  const doublingYears = (72 / (calcReturnRate || 1)).toFixed(1);
  const rMonthly = (calcReturnRate / 100) / 12;
  const totalMonths = calcYears * 12;
  const futureValuePrincipal = calcPrincipal * Math.pow(1 + rMonthly, totalMonths);
  const futureValueDeposits = calcMonthlyDep > 0
    ? calcMonthlyDep * ((Math.pow(1 + rMonthly, totalMonths) - 1) / rMonthly)
    : 0;
  const totalFV = Math.round(futureValuePrincipal + futureValueDeposits);
  const totalPrincipalInvested = Math.round(calcPrincipal + (calcMonthlyDep * totalMonths));
  const totalInterestGained = Math.max(0, totalFV - totalPrincipalInvested);

  // Computations for Emergency Runway
  const runwayMonths = calcMonthlyBurn > 0 ? (calcLiquidReserves / calcMonthlyBurn).toFixed(1) : '0';
  const runwayNum = parseFloat(runwayMonths);
  const runwayStatus = runwayNum < 1
    ? { label: 'Critical Under-Cushion', color: '#FF4D6A', badge: 'bg-[#FF4D6A]/20 text-[#FF4D6A]' }
    : runwayNum < 3
    ? { label: 'Starter Runway (Caution)', color: '#FF9A3C', badge: 'bg-[#FF9A3C]/20 text-[#FF9A3C]' }
    : runwayNum <= 6
    ? { label: 'Safe 3-6mo Standard', color: '#2ECC71', badge: 'bg-[#2ECC71]/20 text-[#2ECC71]' }
    : { label: 'Fortress Runway (6mo+)', color: '#3D9EFF', badge: 'bg-[#3D9EFF]/20 text-[#3D9EFF]' };

  // Computations for Debt Snowball Payoff
  // Approx payoff months
  const monthlyRate = (calcDebtApr / 100) / 12;
  const standardPay = calcDebtMinPay;
  const acceleratedPay = calcDebtMinPay + calcDebtExtraPay;

  const calculatePayoff = (bal: number, rate: number, payment: number) => {
    if (payment <= bal * rate) return { months: 999, totalInterest: 99999 };
    let b = bal;
    let months = 0;
    let totalInt = 0;
    while (b > 0 && months < 360) {
      const intMonth = b * rate;
      totalInt += intMonth;
      b = b + intMonth - payment;
      months++;
    }
    return { months, totalInterest: Math.round(totalInt) };
  };

  const standardResult = calculatePayoff(calcDebtBalance, monthlyRate, standardPay);
  const accelResult = calculatePayoff(calcDebtBalance, monthlyRate, acceleratedPay);
  const monthsSaved = Math.max(0, standardResult.months - accelResult.months);
  const interestSaved = Math.max(0, standardResult.totalInterest - accelResult.totalInterest);

  // Computations for Daily Habit
  const annualSpendHabit = Math.round(calcDailySpend * 365);
  const monthlyDepositHabit = calcDailySpend * 30.416;
  const habitMonths = calcHabitYears * 12;
  const habitR = 0.07 / 12;
  const habitFV = Math.round(monthlyDepositHabit * ((Math.pow(1 + habitR, habitMonths) - 1) / habitR));

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1B33] via-[#0F2444] to-[#081528] border-2 border-[#FDE047]/30 shadow-xl">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-[#FDE047] text-[#06101E] shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              Financial Literacy & <span className="text-[#FDE047]">Interactive Calculators</span>
            </h2>
            <p className="text-xs text-[#9BB5D6] mt-0.5">
              Master core mental models of compound acceleration, runway fortress modeling, and debt snowball reduction.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#1E3352]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FDE047] text-[#06101E] shadow-[0_0_10px_rgba(253,224,71,0.3)]'
                  : 'bg-[#06101E] text-[#9BB5D6] hover:text-white border border-[#1E3352]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE FINANCIAL CALCULATORS SUITE                                   */}
      {/* ========================================================================= */}
      <div id="interactive-calculators-suite" className="p-6 rounded-3xl bg-[#0B1B33]/95 border-2 border-[#1E3352] shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E3352] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#FDE047] text-[#06101E]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Interactive Wealth Calculators</h3>
              <p className="text-xs text-[#9BB5D6]">Simulate cashflow velocity, compounding, and debt payoff in real time</p>
            </div>
          </div>

          {/* Calculator Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#06101E] border border-[#1E3352]">
            <button
              onClick={() => setActiveCalcTab('compound')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCalcTab === 'compound'
                  ? 'bg-[#FDE047] text-[#06101E] shadow-sm'
                  : 'text-[#9BB5D6] hover:text-white'
              }`}
            >
              Rule of 72 & Compound
            </button>
            <button
              onClick={() => setActiveCalcTab('runway')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCalcTab === 'runway'
                  ? 'bg-[#FDE047] text-[#06101E] shadow-sm'
                  : 'text-[#9BB5D6] hover:text-white'
              }`}
            >
              Emergency Runway
            </button>
            <button
              onClick={() => setActiveCalcTab('debt')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCalcTab === 'debt'
                  ? 'bg-[#FDE047] text-[#06101E] shadow-sm'
                  : 'text-[#9BB5D6] hover:text-white'
              }`}
            >
              Debt Snowball Payoff
            </button>
            <button
              onClick={() => setActiveCalcTab('habit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCalcTab === 'habit'
                  ? 'bg-[#FDE047] text-[#06101E] shadow-sm'
                  : 'text-[#9BB5D6] hover:text-white'
              }`}
            >
              Daily Habit Leak
            </button>
            <button
              onClick={() => setActiveCalcTab('fiftythirty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCalcTab === 'fiftythirty'
                  ? 'bg-[#FDE047] text-[#06101E] shadow-sm'
                  : 'text-[#9BB5D6] hover:text-white'
              }`}
            >
              50/30/20 Allocator
            </button>
          </div>
        </div>

        {/* 1. Rule of 72 & Compound Calculator */}
        {activeCalcTab === 'compound' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Initial Principal</span>
                  <span className="text-[#FDE047] font-mono">${calcPrincipal.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={calcPrincipal}
                  onChange={e => setCalcPrincipal(parseInt(e.target.value))}
                  className="w-full accent-[#FDE047]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Monthly Contribution</span>
                  <span className="text-[#FDE047] font-mono">${calcMonthlyDep}/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="50"
                  value={calcMonthlyDep}
                  onChange={e => setCalcMonthlyDep(parseInt(e.target.value))}
                  className="w-full accent-[#FDE047]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#9BB5D6]">Annual Return</span>
                    <span className="text-[#FDE047] font-mono">{calcReturnRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={calcReturnRate}
                    onChange={e => setCalcReturnRate(parseInt(e.target.value))}
                    className="w-full accent-[#FDE047]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#9BB5D6]">Timeline</span>
                    <span className="text-[#FDE047] font-mono">{calcYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="35"
                    value={calcYears}
                    onChange={e => setCalcYears(parseInt(e.target.value))}
                    className="w-full accent-[#FDE047]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06101E] border border-[#1E3352] text-xs space-y-1">
                <span className="font-bold text-[#FDE047] flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Rule of 72 Doubling Time</span>
                </span>
                <p className="text-[#C2D8F2]">
                  At <strong className="text-white">{calcReturnRate}%</strong> annualized return, your invested money doubles automatically every <strong className="text-[#FDE047] font-mono font-black">{doublingYears} years</strong> without additional deposits.
                </p>
              </div>
            </div>

            {/* Compound Visual Output Card */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9BB5D6] tracking-wider">
                  Projected Portfolio in {calcYears} Years
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#2ECC71] font-mono mt-1">
                  ${totalFV.toLocaleString()}
                </div>
                <div className="text-xs text-[#9BB5D6] mt-0.5">
                  Initial principal plus monthly compound yield
                </div>
              </div>

              {/* Progress Stack Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#3D9EFF]">Deposits: ${totalPrincipalInvested.toLocaleString()}</span>
                  <span className="text-[#2ECC71]">Compound Interest: +${totalInterestGained.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 rounded-full bg-[#0F2444] overflow-hidden flex">
                  <div
                    className="h-full bg-[#3D9EFF]"
                    style={{ width: `${Math.max(5, (totalPrincipalInvested / (totalFV || 1)) * 100)}%` }}
                    title="Your deposits"
                  />
                  <div
                    className="h-full bg-[#2ECC71]"
                    style={{ width: `${Math.max(5, (totalInterestGained / (totalFV || 1)) * 100)}%` }}
                    title="Compound gains"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#0B1B33] border border-[#1E3352]">
                  <div className="text-[10px] text-[#9BB5D6] uppercase font-bold">Total Deposited</div>
                  <div className="text-sm font-black text-white font-mono mt-0.5">${totalPrincipalInvested.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1B33] border border-[#1E3352]">
                  <div className="text-[10px] text-[#9BB5D6] uppercase font-bold">Free Compound Wealth</div>
                  <div className="text-sm font-black text-[#2ECC71] font-mono mt-0.5">+${totalInterestGained.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Emergency Runway Fortress Modeler */}
        {activeCalcTab === 'runway' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Baseline Monthly Living Expenses</span>
                  <span className="text-[#FF9A3C] font-mono">${calcMonthlyBurn.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="100"
                  value={calcMonthlyBurn}
                  onChange={e => setCalcMonthlyBurn(parseInt(e.target.value))}
                  className="w-full accent-[#FF9A3C]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Current Liquid Cash & HYSA</span>
                  <span className="text-[#2ECC71] font-mono">${calcLiquidReserves.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={calcLiquidReserves}
                  onChange={e => setCalcLiquidReserves(parseInt(e.target.value))}
                  className="w-full accent-[#2ECC71]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => {
                    setCalcMonthlyBurn(totalMonthlySpend || 3200);
                    const checkingSavings = accounts
                      .filter(a => a.type === 'checking' || a.type === 'savings')
                      .reduce((sum, a) => sum + Math.max(0, a.balance), 0);
                    setCalcLiquidReserves(checkingSavings || 12450);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0F2444] hover:bg-[#132E56] text-[#FDE047] text-xs font-bold border border-[#1E3352] transition-colors"
                >
                  Load My Actual App Balances
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#9BB5D6] tracking-wider">
                    Resilience Runway
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${runwayStatus.badge}`}>
                    {runwayStatus.label}
                  </span>
                </div>
                <div className="text-4xl font-black text-white font-mono mt-1">
                  {runwayMonths} <span className="text-xl text-[#FDE047] font-sans font-bold">Months of Survival</span>
                </div>
                <p className="text-xs text-[#9BB5D6] mt-1">
                  How long your household can fully survive if income stops tomorrow.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#0B1B33] border border-[#1E3352]">
                  <div className="text-[10px] text-[#9BB5D6] uppercase font-bold">3-Month Starter Target</div>
                  <div className="text-sm font-black text-white font-mono mt-0.5">${(calcMonthlyBurn * 3).toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1B33] border border-[#1E3352]">
                  <div className="text-[10px] text-[#9BB5D6] uppercase font-bold">6-Month Fortress Target</div>
                  <div className="text-sm font-black text-[#2ECC71] font-mono mt-0.5">${(calcMonthlyBurn * 6).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Debt Snowball Payoff Accelerator */}
        {activeCalcTab === 'debt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">High-Interest Debt Balance</span>
                  <span className="text-[#FF4D6A] font-mono">${calcDebtBalance.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="250"
                  value={calcDebtBalance}
                  onChange={e => setCalcDebtBalance(parseInt(e.target.value))}
                  className="w-full accent-[#FF4D6A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#9BB5D6]">Interest APR</span>
                    <span className="text-[#FF4D6A] font-mono">{calcDebtApr}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="0.5"
                    value={calcDebtApr}
                    onChange={e => setCalcDebtApr(parseFloat(e.target.value))}
                    className="w-full accent-[#FF4D6A]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#9BB5D6]">Min Payment</span>
                    <span className="text-white font-mono">${calcDebtMinPay}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="500"
                    step="10"
                    value={calcDebtMinPay}
                    onChange={e => setCalcDebtMinPay(parseInt(e.target.value))}
                    className="w-full accent-[#FDE047]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Accelerated Snowball Extra Pay</span>
                  <span className="text-[#2ECC71] font-mono">+${calcDebtExtraPay}/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="25"
                  value={calcDebtExtraPay}
                  onChange={e => setCalcDebtExtraPay(parseInt(e.target.value))}
                  className="w-full accent-[#2ECC71]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9BB5D6] tracking-wider">
                  Debt-Free Acceleration Impact
                </span>
                <div className="text-3xl font-black text-[#2ECC71] font-mono mt-1">
                  {accelResult.months} Months to $0 Balance
                </div>
                <p className="text-xs text-[#9BB5D6] mt-0.5">
                  vs {standardResult.months >= 360 ? '30+ Years' : `${standardResult.months} Months`} on minimums alone.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#0B1B33] border border-[#1E3352]">
                  <div className="text-[10px] text-[#9BB5D6] uppercase font-bold">Months Shaved Off</div>
                  <div className="text-base font-black text-[#FDE047] font-mono mt-0.5">
                    {monthsSaved} Months Sooner
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1B33] border border-[#1E3352]">
                  <div className="text-[10px] text-[#9BB5D6] uppercase font-bold">Interest Saved</div>
                  <div className="text-base font-black text-[#2ECC71] font-mono mt-0.5">
                    +${interestSaved.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Daily Habit Opportunity Cost */}
        {activeCalcTab === 'habit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Daily Habit Cost (Coffee, Snacks, Takeout)</span>
                  <span className="text-[#FDE047] font-mono">${calcDailySpend}/day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  value={calcDailySpend}
                  onChange={e => setCalcDailySpend(parseInt(e.target.value))}
                  className="w-full accent-[#FDE047]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Compounding Horizon</span>
                  <span className="text-[#FDE047] font-mono">{calcHabitYears} Years</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  value={calcHabitYears}
                  onChange={e => setCalcHabitYears(parseInt(e.target.value))}
                  className="w-full accent-[#FDE047]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06101E] border border-[#1E3352] text-xs">
                A ${calcDailySpend}/day purchase equals <strong className="text-[#FF9A3C] font-mono">${annualSpendHabit}/year</strong> in direct cash outflow.
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9BB5D6] tracking-wider">
                  Opportunity Cost in {calcHabitYears} Years @ 7%
                </span>
                <div className="text-4xl font-black text-[#2ECC71] font-mono mt-1">
                  ${habitFV.toLocaleString()}
                </div>
                <p className="text-xs text-[#9BB5D6] mt-1">
                  The true potential future wealth if this daily amount was invested into broad index funds instead.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1B33] border border-[#1E3352] text-xs text-[#C2D8F2]">
                💡 <strong>The Mind Map Strategy:</strong> Rather than total deprivation, redirecting just 50% of everyday micro-leaks can fund your highest milestone goals without sacrificing life satisfaction.
              </div>
            </div>
          </div>
        )}

        {/* 5. 50/30/20 Allocator */}
        {activeCalcTab === 'fiftythirty' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9BB5D6]">Monthly Net Take-Home Pay</span>
                  <span className="text-[#FDE047] font-mono">${calcMonthlyIncome.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="18000"
                  step="250"
                  value={calcMonthlyIncome}
                  onChange={e => setCalcMonthlyIncome(parseInt(e.target.value))}
                  className="w-full accent-[#FDE047]"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#06101E] border border-[#1E3352] flex justify-between items-center">
                  <span className="text-[#3D9EFF] font-bold">50% Needs & Essentials</span>
                  <span className="text-white font-mono font-bold">${(calcMonthlyIncome * 0.5).toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#06101E] border border-[#1E3352] flex justify-between items-center">
                  <span className="text-[#A78BFA] font-bold">30% Wants & Discretionary</span>
                  <span className="text-white font-mono font-bold">${(calcMonthlyIncome * 0.3).toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#06101E] border border-[#1E3352] flex justify-between items-center">
                  <span className="text-[#2ECC71] font-bold">20% Savings & Accelerated Payoff</span>
                  <span className="text-white font-mono font-bold">${(calcMonthlyIncome * 0.2).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9BB5D6] tracking-wider">
                  Target Wealth Velocity
                </span>
                <div className="text-3xl font-black text-[#2ECC71] font-mono mt-1">
                  ${(calcMonthlyIncome * 0.2 * 12).toLocaleString()}/yr
                </div>
                <p className="text-xs text-[#9BB5D6] mt-0.5">
                  Annual capital redirected directly toward your goals & high-yield assets.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B1B33] border border-[#1E3352] text-xs text-[#C2D8F2]">
                Your active Mind Map monthly spending is currently <strong className="text-white">${totalMonthlySpend.toLocaleString()}</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Structured Lessons List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Financial Principles ({filteredLessons.length} Modules)
        </h3>

        {filteredLessons.map(lesson => {
          const Icon = getLessonIcon(lesson.icon);
          const isExpanded = expandedLessonId === lesson.id;

          return (
            <div
              key={lesson.id}
              className="rounded-3xl bg-[#0B1B33]/90 border border-[#1E3352] hover:border-[#FDE047]/30 transition-all overflow-hidden shadow-md"
            >
              <button
                onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#0F2444]/50 transition-colors"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#06101E] text-[#FDE047] border border-[#1E3352] flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0F2444] text-[#FDE047] border border-[#1E3352]">
                        {lesson.category}
                      </span>
                      <span className="text-xs text-[#9BB5D6]">{lesson.duration}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5 truncate">{lesson.title}</h4>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-[#9BB5D6]">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-[#FDE047]" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-[#1E3352]/70 bg-[#06101E]/60 text-xs text-[#C2D8F2] space-y-3 animate-in fade-in duration-150">
                  <p className="leading-relaxed">{lesson.content}</p>
                  <div className="p-3.5 rounded-2xl bg-[#0B1B33] border border-[#1E3352] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#FDE047] flex items-center space-x-1">
                      <Lightbulb className="w-3.5 h-3.5 text-[#FDE047]" />
                      <span>Actionable Takeaway</span>
                    </span>
                    <p className="text-white font-medium">{lesson.tip}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
