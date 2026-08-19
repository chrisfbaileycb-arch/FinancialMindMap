import React from 'react';
import {
  Network,
  LayoutDashboard,
  Target,
  TrendingUp,
  GraduationCap,
  ShieldAlert,
  Lock,
  Unlock,
  RefreshCw,
  PlusCircle,
  Sparkles,
  Link2,
  BookOpen,
  FileText,
  Compass,
} from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';
import { NavigationTab } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenLinkModal: () => void;
  onOpenAddTxModal: () => void;
  onOpenGuideModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLinkModal,
  onOpenAddTxModal,
  onOpenGuideModal,
}) => {
  const {
    unreadAlertCount,
    isAuthenticated,
    toggleAuth,
    isSyncing,
    syncAllAccounts,
    totalBalance,
    isCopilotActive,
    setIsCopilotActive,
    highlightedElementId,
  } = useFinanceContext();

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'cover', label: 'Cover & Manual', icon: BookOpen },
    { id: 'mindmap', label: 'Mind Map', icon: Network },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E3352] bg-[#040914]/95 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('cover')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FDE047] via-[#EAB308] to-[#CA8A04] text-[#06101E] shadow-[0_0_20px_rgba(253,224,71,0.4)]">
              <Network className="w-5 h-5 font-black" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2ECC71] border-2 border-[#040914]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Financial<span className="text-[#FDE047]">MindMap</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-[#FDE047]/15 text-[#FDE047] border border-[#FDE047]/30">
                  Visual Budget
                </span>
              </div>
              <p className="text-[11px] text-[#9BB5D6] hidden md:block">Interactive Wealth & Cashflow Topology</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-2xl bg-[#0B1B33] border border-[#1E3352]">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FDE047] text-[#06101E] shadow-[0_0_15px_rgba(253,224,71,0.4)]'
                      : 'text-[#9BB5D6] hover:text-white hover:bg-[#0F2444]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.id === 'dashboard' && unreadAlertCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#FF4D6A] text-white">
                      {unreadAlertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Center & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Co-Pilot Toggle Switch */}
            <button
              id="btn-toggle-copilot"
              onClick={() => setIsCopilotActive(!isCopilotActive)}
              title={isCopilotActive ? 'Co-Pilot Active (Click to pause)' : 'Activate Step-by-Step Co-Pilot'}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isCopilotActive
                  ? 'bg-[#FDE047] text-[#06101E] shadow-[0_0_15px_rgba(253,224,71,0.4)]'
                  : 'bg-[#0F2444] text-[#9BB5D6] hover:text-white border border-[#1E3352]'
              }`}
            >
              <Compass className={`w-4 h-4 ${isCopilotActive ? 'animate-spin-slow text-[#06101E]' : ''}`} />
              <span className="hidden xl:inline">Co-Pilot</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isCopilotActive ? 'bg-[#06101E]' : 'bg-slate-500'}`} />
            </button>

            {/* User Guide Button */}
            <button
              id="btn-user-guide"
              onClick={onOpenGuideModal}
              title="User Instructions & Onboarding Guide"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0F2444] hover:bg-[#132E56] text-[#FDE047] border border-[#FDE047]/40 shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#FDE047]" />
              <span className="hidden xl:inline">User Guide</span>
            </button>

            {/* Net Worth Summary Badge */}
            <div className="hidden sm:flex flex-col items-end px-3.5 py-1.5 rounded-xl bg-[#0B1B33] border border-[#1E3352]">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#9BB5D6]">Total Balance</span>
              <span className="text-xs font-black text-[#FDE047] font-mono">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Quick Add Tx */}
            <button
              id="btn-quick-add-tx"
              onClick={onOpenAddTxModal}
              title="Add Transaction"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0F2444] hover:bg-[#132E56] text-white border border-[#1E3352] transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#FDE047]" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>

            {/* Link Bank (Plaid) - Pastel Yellow Button */}
            <button
              id="btn-link-bank-top"
              onClick={onOpenLinkModal}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] shadow-[0_0_18px_rgba(253,224,71,0.4)] transition-all ${
                highlightedElementId === 'btn-link-bank-top' ? 'ring-4 ring-[#FDE047] scale-105 animate-pulse' : ''
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Link Bank</span>
            </button>

            {/* Sync All Button */}
            <button
              id="btn-sync-all"
              onClick={syncAllAccounts}
              disabled={isSyncing}
              title="Sync Bank Feeds"
              className={`p-2 rounded-xl bg-[#0B1B33] hover:bg-[#0F2444] text-[#9BB5D6] hover:text-[#FDE047] border border-[#1E3352] transition-colors ${
                isSyncing ? 'opacity-50 cursor-wait' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 text-[#FDE047] ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* Auth / Security Lock Status */}
            <button
              id="btn-toggle-auth"
              onClick={toggleAuth}
              title={isAuthenticated ? 'Active User Session (Click to lock)' : 'Locked (Click to unlock)'}
              className={`p-2 rounded-xl border transition-colors ${
                isAuthenticated
                  ? 'bg-[#2ECC71]/15 border-[#2ECC71]/40 text-[#2ECC71] hover:bg-[#2ECC71]/25'
                  : 'bg-[#FF4D6A]/15 border-[#FF4D6A]/40 text-[#FF4D6A] hover:bg-[#FF4D6A]/25'
              }`}
            >
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-[#1E3352]/60 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#FDE047] text-[#06101E] shadow-sm'
                    : 'text-[#9BB5D6] bg-[#0B1B33] border border-[#1E3352]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.id === 'dashboard' && unreadAlertCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#FF4D6A] text-white">
                    {unreadAlertCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
