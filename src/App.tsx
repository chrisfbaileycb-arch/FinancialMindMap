import React, { useState } from 'react';
import { FinanceProvider, useFinanceContext } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { IdentityAlertBanner } from './components/IdentityAlertBanner';
import { CoverPage } from './components/cover/CoverPage';
import { MindMapCanvas } from './components/mindmap/MindMapCanvas';
import { DashboardView } from './components/dashboard/DashboardView';
import { GoalsView } from './components/goals/GoalsView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { LearnView } from './components/learn/LearnView';
import { PlaidLinkModal } from './components/modals/PlaidLinkModal';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AddGoalModal } from './components/modals/AddGoalModal';
import { CoverGuideModal } from './components/modals/CoverGuideModal';
import { NavigationTab } from './types';
import { Lock, Unlock, Network, ShieldCheck, Heart, BookOpen, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('cover');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const { isAuthenticated, toggleAuth } = useFinanceContext();

  // If user is on the Cover Page, render the crisp fresh white cover experience
  if (currentTab === 'cover') {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenLinkModal={() => setIsLinkModalOpen(true)}
          onOpenAddTxModal={() => setIsAddTxModalOpen(true)}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />

        {/* Crisp White Cover Page */}
        <CoverPage
          onNavigateTab={setCurrentTab}
          onOpenLinkBank={() => setIsLinkModalOpen(true)}
          onOpenAddTx={() => setIsAddTxModalOpen(true)}
        />

        {/* Modals */}
        <CoverGuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          onOpenLinkBank={() => setIsLinkModalOpen(true)}
        />
        <PlaidLinkModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
        />
        <AddTransactionModal
          isOpen={isAddTxModalOpen}
          onClose={() => setIsAddTxModalOpen(false)}
        />
        <AddGoalModal
          isOpen={isAddGoalModalOpen}
          onClose={() => setIsAddGoalModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-[#F0F6FF] flex flex-col font-sans selection:bg-[#FDE047]/30 selection:text-[#FDE047]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenLinkModal={() => setIsLinkModalOpen(true)}
        onOpenAddTxModal={() => setIsAddTxModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* Security & Spending Alerts Banner */}
      <IdentityAlertBanner />

      {/* Main App Body - Fluid full width without arbitrary narrow constraints */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-5">
        {!isAuthenticated ? (
          /* Lock Screen State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-3xl bg-[#FF4D6A]/10 border border-[#FF4D6A]/30 text-[#FF4D6A] shadow-[0_0_30px_rgba(255,77,106,0.2)]">
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-white">App Session Protected</h2>
            <p className="text-xs text-[#9BB5D6] leading-relaxed">
              Your financial mind map and account balances are locked for privacy. Click below to unlock your active session.
            </p>
            <button
              onClick={toggleAuth}
              className="px-6 py-2.5 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black shadow-[0_0_20px_rgba(253,224,71,0.35)] transition-all"
            >
              Unlock Financial Mind Map
            </button>
          </div>
        ) : (
          /* Tab Views */
          <div className="w-full">
            {currentTab === 'mindmap' && (
              <MindMapCanvas onOpenGuide={() => setIsGuideModalOpen(true)} />
            )}
            {currentTab === 'dashboard' && (
              <DashboardView
                onOpenLinkModal={() => setIsLinkModalOpen(true)}
                onOpenAddTxModal={() => setIsAddTxModalOpen(true)}
              />
            )}
            {currentTab === 'goals' && (
              <GoalsView onOpenAddGoalModal={() => setIsAddGoalModalOpen(true)} />
            )}
            {currentTab === 'portfolio' && <PortfolioView />}
            {currentTab === 'learn' && <LearnView />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E3352]/70 bg-[#040914]/80 py-5 mt-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9BB5D6]">
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-[#FDE047]" />
            <span className="font-bold text-white">FinancialMindMap</span>
            <span>— Visual Cashflow & Wealth Topology</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentTab('cover')}
              className="text-[#FDE047] hover:underline flex items-center space-x-1 font-bold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cover & Manual</span>
            </button>
            <span className="flex items-center space-x-1 text-[#9BB5D6]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2ECC71]" />
              <span>AES-256 Mock Sandbox Connected</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CoverGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onOpenLinkBank={() => setIsLinkModalOpen(true)}
      />
      <PlaidLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
      />
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

export default App;

