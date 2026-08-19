import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  AlertTriangle,
  Sparkles,
  Send,
  CreditCard,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Plus,
  CheckCircle2,
  Flag,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

interface DashboardViewProps {
  onOpenLinkModal: () => void;
  onOpenAddTxModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenLinkModal,
  onOpenAddTxModal,
}) => {
  const {
    accounts,
    institutions,
    transactions,
    alerts,
    totalBalance,
    totalMonthlySpend,
    unreadAlertCount,
    dismissAlert,
    toggleFlagTransaction,
    isSyncing,
    syncAllAccounts,
    askFinancialInsight,
  } = useFinanceContext();

  const [txFilter, setTxFilter] = useState<'all' | 'flagged'>('all');
  const [insightQuery, setInsightQuery] = useState('');
  const [insightAnswer, setInsightAnswer] = useState<string | null>(
    '👋 **Hello!** I am your AI Financial Copilot. Ask me about your spending trends, potential leaks, goal milestones, or budget health.'
  );
  const [isThinking, setIsThinking] = useState(false);

  const QUICK_PROMPTS = [
    'How much did I spend on dining?',
    'What is my biggest expense category?',
    'Am I on track with my budget?',
    'Where can I save the most money?',
  ];

  const handleAskPrompt = async (prompt: string) => {
    setInsightQuery(prompt);
    setIsThinking(true);
    const ans = await askFinancialInsight(prompt);
    setInsightAnswer(ans);
    setIsThinking(false);
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightQuery.trim()) return;
    setIsThinking(true);
    const ans = await askFinancialInsight(insightQuery.trim());
    setInsightAnswer(ans);
    setIsThinking(false);
  };

  const filteredTransactions = txFilter === 'flagged'
    ? transactions.filter(t => t.flagged)
    : transactions;

  return (
    <div className="space-y-6 w-full">
      {/* Top Overview Metric Card */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-[#0B1B33] via-[#0F2444] to-[#081528] border-2 border-[#FDE047]/30 shadow-[0_0_35px_rgba(253,224,71,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#9BB5D6]">
                Total Liquid & Investment Net Balance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30">
                Live Aggregated
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1.5">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={syncAllAccounts}
              disabled={isSyncing}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#081528] hover:bg-[#132E56] text-[#9BB5D6] hover:text-[#FDE047] border border-[#1E3352] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FDE047] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Feeds'}</span>
            </button>
            <button
              onClick={onOpenLinkModal}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] shadow-[0_0_15px_rgba(253,224,71,0.35)] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Bank</span>
            </button>
          </div>
        </div>

        {/* 3-Column Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-4 border-t border-[#1E3352]">
          <div className="p-3.5 rounded-2xl bg-[#06101E]/70 border border-[#1E3352]/70">
            <div className="text-[11px] text-[#9BB5D6] font-bold">This Month Spent</div>
            <div className="text-lg font-black text-[#FF9A3C] font-mono mt-0.5">
              ${totalMonthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-[#9BB5D6] mt-1">Across 7 Active Categories</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#06101E]/70 border border-[#1E3352]/70">
            <div className="text-[11px] text-[#9BB5D6] font-bold">Connected Accounts</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {accounts.length} Active Feeds
            </div>
            <div className="text-[10px] text-[#2ECC71] mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#06101E]/70 border border-[#1E3352]/70">
            <div className="text-[11px] text-[#9BB5D6] font-bold">Security & Spending Alerts</div>
            <div className="text-lg font-black text-[#FDE047] font-mono mt-0.5">
              {unreadAlertCount} Pending Review
            </div>
            <div className="text-[10px] text-[#9BB5D6] mt-1">1 High-Risk Price Increase</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Accounts & Transactions) | Right Column (AI Copilot & Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Accounts and Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Linked Bank Accounts */}
          <div className="p-6 rounded-3xl bg-[#0B1B33]/90 border border-[#1E3352] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#FDE047] text-[#06101E]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Linked Financial Accounts</h3>
                  <p className="text-xs text-[#9BB5D6]">Checking, Savings, Credit Cards & Brokerages</p>
                </div>
              </div>
              <button
                onClick={onOpenLinkModal}
                className="text-xs text-[#FDE047] hover:underline font-bold"
              >
                + Add Bank
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accounts.map(acc => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-[#06101E]/80 border border-[#1E3352] hover:border-[#FDE047]/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BB5D6]">
                        {acc.institution} ••••{acc.accountNumberMask || '4821'}
                      </span>
                      <div className="text-xs font-bold text-white mt-0.5">{acc.name}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#0F2444] text-[#FDE047] border border-[#1E3352]">
                      {acc.type}
                    </span>
                  </div>
                  <div className="text-base font-black text-white font-mono mt-3">
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="p-6 rounded-3xl bg-[#0B1B33]/90 border border-[#1E3352] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#0F2444] text-[#FDE047] border border-[#FDE047]/30">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Recent Transactions</h3>
                  <p className="text-xs text-[#9BB5D6]">Synchronized across all linked accounts</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#06101E] border border-[#1E3352]">
                  <button
                    onClick={() => setTxFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      txFilter === 'all'
                        ? 'bg-[#FDE047] text-[#06101E]'
                        : 'text-[#9BB5D6] hover:text-white'
                    }`}
                  >
                    All ({transactions.length})
                  </button>
                  <button
                    onClick={() => setTxFilter('flagged')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                      txFilter === 'flagged'
                        ? 'bg-[#FF4D6A] text-white'
                        : 'text-[#9BB5D6] hover:text-white'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>Flagged</span>
                  </button>
                </div>

                <button
                  onClick={onOpenAddTxModal}
                  className="px-3 py-1.5 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black transition-all flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log Expense</span>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#06101E]/80 border border-[#1E3352] hover:border-[#FDE047]/30 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      onClick={() => toggleFlagTransaction(tx.id)}
                      title={tx.flagged ? 'Flagged for review' : 'Flag this transaction'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        tx.flagged
                          ? 'text-[#FF4D6A] bg-[#FF4D6A]/20'
                          : 'text-[#9BB5D6] hover:text-white hover:bg-[#0F2444]'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{tx.merchant}</div>
                      <div className="text-[10px] text-[#9BB5D6] flex items-center space-x-2 mt-0.5">
                        <span className="text-[#FDE047] font-semibold">{tx.category}</span>
                        <span>•</span>
                        <span>{tx.account}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-black text-white font-mono flex-shrink-0">
                    -${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Copilot & Alerts */}
        <div className="space-y-6">
          {/* AI Financial Copilot */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B1B33] to-[#0F2444] border-2 border-[#FDE047]/40 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#FDE047] text-[#06101E] shadow-[0_0_12px_rgba(253,224,71,0.4)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">AI Financial Copilot</h3>
                <p className="text-xs text-[#9BB5D6]">Instant insights on your topology & spending</p>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => handleAskPrompt(p)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#06101E] hover:bg-[#132E56] text-[#FDE047] border border-[#1E3352] transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Answer Display */}
            <div className="p-4 rounded-2xl bg-[#06101E]/90 border border-[#1E3352] text-xs text-[#E0ECFC] leading-relaxed min-h-[120px]">
              {isThinking ? (
                <div className="flex items-center space-x-2 text-[#FDE047] py-4">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="font-semibold">Analyzing your cashflow topology...</span>
                </div>
              ) : (
                <div className="whitespace-pre-line">{insightAnswer}</div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleCustomQuery} className="flex gap-2">
              <input
                type="text"
                value={insightQuery}
                onChange={e => setInsightQuery(e.target.value)}
                placeholder="Ask anything about your money..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] transition-all font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Security & Financial Alerts Feed */}
          <div className="p-6 rounded-3xl bg-[#0B1B33]/90 border border-[#1E3352] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#FF4D6A]/20 text-[#FF4D6A]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Security & Audit Alerts</h3>
                  <p className="text-xs text-[#9BB5D6]">Price increases & suspicious charges</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    alert.severity === 'high'
                      ? 'bg-[#FF4D6A]/10 border-[#FF4D6A]/30'
                      : alert.severity === 'medium'
                      ? 'bg-[#FF9A3C]/10 border-[#FF9A3C]/30'
                      : 'bg-[#FDE047]/10 border-[#FDE047]/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-xs font-bold text-white">{alert.title}</div>
                    {!alert.read && (
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-[10px] text-[#2ECC71] hover:underline font-bold flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9BB5D6] mt-1 leading-relaxed">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
