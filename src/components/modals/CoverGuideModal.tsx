import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Target,
  Network,
  CheckCircle2,
  Lock,
  Link2,
  DollarSign,
  PieChart,
  ArrowRight,
  HelpCircle,
  Award,
  Clock,
  ChevronRight,
  Sliders,
  Layers
} from 'lucide-react';

interface CoverGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLinkBank: () => void;
}

export const CoverGuideModal: React.FC<CoverGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenLinkBank,
}) => {
  const [activeSection, setActiveSection] = useState<'welcome' | 'signup' | 'mindmap' | 'benefits'>('welcome');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#030712]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0B1B33] via-[#071324] to-[#040914] border-2 border-[#FDE047]/40 shadow-[0_0_50px_rgba(253,224,71,0.15)] overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E3352] bg-[#0F2444]/60 backdrop-blur-md">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-[#FDE047] text-[#06101E] shadow-[0_0_15px_rgba(253,224,71,0.4)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Financial Mind Map <span className="text-[#FDE047]">User Guide & Manual</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FDE047]/15 text-[#FDE047] border border-[#FDE047]/30">
                  Interactive Guide
                </span>
              </div>
              <p className="text-xs text-[#9BB5D6]">
                How to set up your accounts, master the visual topology, and maximize wealth retention.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9BB5D6] hover:text-[#FDE047] hover:bg-[#132E56] transition-colors border border-[#1E3352]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-[#1E3352] bg-[#081528] px-6 py-2 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'welcome', label: '1. Overview & Cover', icon: Sparkles },
            { id: 'signup', label: '2. Sign Up & Bank Sync', icon: Link2 },
            { id: 'mindmap', label: '3. Mastering the Mind Map', icon: Network },
            { id: 'benefits', label: '4. Real Benefits & Impact', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FDE047] text-[#06101E] shadow-[0_0_12px_rgba(253,224,71,0.3)]'
                    : 'text-[#9BB5D6] hover:text-white hover:bg-[#0F2444]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#E0ECFC]">
          {/* SECTION 1: OVERVIEW & COVER */}
          {activeSection === 'welcome' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F2444] to-[#132E56] border border-[#FDE047]/30 shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FDE047]">
                      Next-Generation Visual Finance
                    </span>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      Transform Cluttered Spreadsheets into an Intuitive Financial Universe
                    </h3>
                    <p className="text-xs text-[#C2D8F2] leading-relaxed max-w-2xl">
                      Traditional finance apps bury your money in boring tables. FinancialMindMap arranges your income, categories, accounts, and debt as a living, breathing orbital topology. You can instantly see where every dollar flows at a glance.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSection('signup')}
                    className="px-5 py-2.5 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-extrabold shadow-[0_0_15px_rgba(253,224,71,0.3)] transition-all flex items-center space-x-2 flex-shrink-0"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FDE047]/15 text-[#FDE047] flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Instant Spatial Clarity</h4>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Bubbles resize and pulse based on real spending velocity, giving you subconscious awareness before you exceed monthly thresholds.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FDE047]/15 text-[#FDE047] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Proactive Security</h4>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Automated anomaly detection spots hidden subscription increases, double billings, and unauthorized transactions immediately.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FDE047]/15 text-[#FDE047] flex items-center justify-center font-bold">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Goal Velocity</h4>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Connect saving targets to live balances. Celebrate milestones with visual reward loops and automated pacing calculators.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SIGN UP & ONBOARDING */}
          {activeSection === 'signup' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">How to Set Up & Connect Your Accounts</h3>
                <p className="text-xs text-[#9BB5D6]">
                  Follow these 3 quick steps to initialize your personal financial topology.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-[#081528] border border-[#1E3352]">
                  <div className="w-7 h-7 rounded-xl bg-[#FDE047] text-[#06101E] font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Connect Financial Institutions via Plaid</h4>
                    <p className="text-xs text-[#9BB5D6] leading-relaxed">
                      Click the <strong className="text-[#FDE047]">"Link Bank"</strong> button in the top navigation bar. Select your bank (Chase, Bank of America, Fidelity, Vanguard, Wells Fargo, etc.) or search for any credit union. The end-to-end encrypted connection securely imports your live balances and recent transactions.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenLinkBank();
                      }}
                      className="inline-flex items-center space-x-1.5 mt-2 px-3 py-1.5 rounded-lg bg-[#FDE047] text-[#06101E] text-xs font-bold hover:bg-[#FEF08A]"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Link an Account Now</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-[#081528] border border-[#1E3352]">
                  <div className="w-7 h-7 rounded-xl bg-[#FDE047] text-[#06101E] font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Set Your Monthly Category Budgets</h4>
                    <p className="text-xs text-[#9BB5D6] leading-relaxed">
                      Click any category bubble on the Financial Mind Map (such as Housing, Food & Dining, Travel, or Entertainment) and use the <strong className="text-[#FDE047]">"Adjust Monthly Budget"</strong> slider to set your comfortable spending target for the month.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-[#081528] border border-[#1E3352]">
                  <div className="w-7 h-7 rounded-xl bg-[#FDE047] text-[#06101E] font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Establish Target Wealth Goals</h4>
                    <p className="text-xs text-[#9BB5D6] leading-relaxed">
                      Switch to the <strong className="text-[#FDE047]">"Goals"</strong> tab to configure your Emergency Fund, Down Payment, Vehicle, or Vacation milestones. The app computes exact monthly deposits needed to reach completion on time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: MASTERING THE MIND MAP */}
          {activeSection === 'mindmap' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Mastering the Interactive Financial Mind Map</h3>
                <p className="text-xs text-[#9BB5D6]">
                  How to interact with nodes, read visual signals, and customize your layout.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#FDE047]">
                    <Layers className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Central Master Hub</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    The large central sphere calculates your total monthly burn rate against your global budget. Click the center node to open the comprehensive <strong className="text-[#FDE047]">Cashflow Breakdown</strong> with category rankings and remaining safety cushions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#FDE047]">
                    <Sliders className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Orbiting Category Spheres</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Categories automatically expand in size as spending rises. If a category exceeds 100% of its budget, it emits a pulsing red warning ring. Click any sphere to open its live transaction ledger and edit targets.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#FDE047]">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Drag, Zoom & Pan Freedom</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Drag any category node to reposition it anywhere on your canvas. Click and drag the empty background to pan, and use the zoom controls or <strong className="text-[#FDE047]">"Recenter"</strong> button to restore the radial alignment.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#FDE047]">
                    <Network className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Full Screen Overlay View</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Click <strong className="text-[#FDE047]">"Full Overlay"</strong> on the canvas toolbar to expand the mind map edge-to-edge. Filter nodes instantly between All, Overspent, and Top 5 Spenders.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: REAL BENEFITS & TRACKING FINANCES */}
          {activeSection === 'benefits' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">How Financial Mind Map Transforms Your Wealth</h3>
                <p className="text-xs text-[#9BB5D6]">
                  Real-world psychological and financial advantages over old-fashioned budgeting tools.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#2ECC71]">
                    <TrendingUp className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Average $420/mo in Savings</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Users identify phantom subscriptions, recurring hidden fee creeps, and lifestyle inflation within their first 7 days through spatial color-coded nodes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#FDE047]">
                    <Clock className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Zero Spreadsheet Fatigue</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    No manual data entry or complex formulas. Live bank syncing and topological visual nodes turn weekly check-ins into an enjoyable 60-second review.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#3D9EFF]">
                    <PieChart className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Unified Asset & Debt Topology</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    View retirement accounts, stock portfolios, high-yield savings, checking accounts, and credit card balances in a single consolidated dashboard.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#081528] border border-[#1E3352] space-y-2">
                  <div className="flex items-center space-x-2 text-[#A78BFA]">
                    <Award className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Financial Literacy Calculators</h4>
                  </div>
                  <p className="text-xs text-[#9BB5D6] leading-relaxed">
                    Access the interactive Compound Interest growth simulator, Debt Snowball payoff matrix, and Rule of 72 estimators directly within the Learn hub.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E3352] bg-[#0F2444]/70">
          <div className="text-xs text-[#9BB5D6] hidden sm:block">
            Tip: You can re-open this guide anytime via the <strong className="text-[#FDE047]">User Guide</strong> button in the top bar.
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black shadow-[0_0_15px_rgba(253,224,71,0.35)] transition-all flex items-center space-x-2"
            >
              <span>Explore Financial Mind Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
