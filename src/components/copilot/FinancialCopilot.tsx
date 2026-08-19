import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  X,
  Eye,
  Power,
  Layers,
  ShieldCheck,
  Zap,
  Target,
  Bell,
  Calculator,
  ArrowRight,
  Maximize2,
  Minimize2,
  Info,
} from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';
import { NavigationTab, CopilotStep } from '../../types';

interface FinancialCopilotProps {
  currentTab: NavigationTab;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenLinkBank: () => void;
  onOpenAddTx: () => void;
}

const COPILOT_STEPS: CopilotStep[] = [
  {
    id: 1,
    title: '1. New Sign-Up & Workflow Bubble',
    shortDesc: 'Understand the master cashflow hub & orbit topology',
    details:
      'When you first sign up or log in, your central master hub forms the core cashflow workflow bubble. Surrounding bubbles orbit with diameters directly proportional to your monthly spending volume. A red halo indicates you have exceeded that category budget ceiling.',
    actionText: 'Spotlight Master Hub',
    targetTab: 'mindmap',
    highlightSelector: 'node-mindmap-center',
    tip: 'Click on the central hub or any orbiting category bubble to inspect real transactions and live sliders.',
  },
  {
    id: 2,
    title: '2. Connect Bank Institutions',
    shortDesc: 'Aggregate checking, savings, & cards via read-only sandbox',
    details:
      'Link your financial institutions using encrypted bank aggregation. Your accounts, real-time balances, and transaction feeds sync securely into the mind map without storing login credentials.',
    actionText: 'Point Out Link Bank',
    targetTab: 'mindmap',
    highlightSelector: 'btn-link-bank-top',
    tip: 'All connections use bank-level 256-bit encryption with zero-knowledge credential isolation.',
  },
  {
    id: 3,
    title: '3. Tune Category Orbits & Limits',
    shortDesc: 'Customize monthly budget ceilings with live sliders',
    details:
      'Click any category node (such as Food & Dining, Housing, or Transport). A side ledger drawer opens, allowing you to drag budget limits, check consumption percentage, or log a fast receipt on the fly.',
    actionText: 'Inspect Food & Dining Node',
    targetTab: 'mindmap',
    highlightSelector: 'node-cat-2',
    tip: 'Dragging a category bubble repositions it in 2D space so you can organize your map intuitively.',
  },
  {
    id: 4,
    title: '4. Goal Milestones & Emergency Cushion',
    shortDesc: 'Automate high-yield savings and vacation targets',
    details:
      'Navigate to the Goals tab to track your Emergency Runway Fortress, Car Down Payment, or debt-free milestones. Use the simulated deposit buttons to project milestone velocity.',
    actionText: 'Go to Financial Goals',
    targetTab: 'goals',
    highlightSelector: 'goals-section-header',
    tip: 'Aim for a 3–6 month emergency reserve in a high-yield account before accelerating non-essential investments.',
  },
  {
    id: 5,
    title: '5. Stealth Leak & Identity Radar',
    shortDesc: 'Catch sneaky price hikes and unverified charges',
    details:
      'Our radar continuously scans for silent subscription price hikes (e.g. streaming rate bumps) and abnormal merchant transactions. View active alerts directly on the top banner or dashboard view.',
    actionText: 'Inspect Alert Banner',
    targetTab: 'dashboard',
    highlightSelector: 'identity-alert-banner',
    tip: 'Flagged transactions display a warning badge and can be reviewed or dismissed anytime.',
  },
  {
    id: 6,
    title: '6. Interactive Wealth Calculators',
    shortDesc: 'Simulate Rule of 72 compound interest & debt payoff',
    details:
      'Visit the Learn hub to access our interactive financial calculators: Rule of 72 Doubling Time, Emergency Runway Modeler, Accelerated Debt Snowball, Daily Habit Opportunity Cost, and 50/30/20 Allocator.',
    actionText: 'Open Wealth Calculators',
    targetTab: 'learn',
    highlightSelector: 'interactive-calculators-suite',
    tip: 'Adjust the sliders to see how small extra monthly contributions shave years off debt balances.',
  },
];

export const FinancialCopilot: React.FC<FinancialCopilotProps> = ({
  currentTab,
  onNavigateTab,
  onOpenLinkBank,
  onOpenAddTx,
}) => {
  const {
    isCopilotActive,
    setIsCopilotActive,
    activeCopilotStep,
    setActiveCopilotStep,
    triggerHighlight,
  } = useFinanceContext();

  const [isMinimized, setIsMinimized] = useState(false);

  // If deactivated, render discrete activation badge on the right
  if (!isCopilotActive) {
    return (
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in duration-300">
        <button
          onClick={() => setIsCopilotActive(true)}
          className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-[#0B1B33]/95 backdrop-blur-xl border border-[#1E3352] hover:border-[#FDE047] text-white hover:text-[#FDE047] shadow-2xl transition-all group"
          title="Activate Step-by-Step Co-Pilot"
        >
          <div className="p-1.5 rounded-xl bg-[#06101E] text-[#9BB5D6] group-hover:text-[#FDE047] group-hover:bg-[#FDE047]/20 transition-colors">
            <Power className="w-4 h-4" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-black">Financial Co-Pilot</div>
            <div className="text-[10px] text-[#9BB5D6] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>Deactivated (Click to Start)</span>
            </div>
          </div>
        </button>
      </div>
    );
  }

  const currentStepData = COPILOT_STEPS[activeCopilotStep] || COPILOT_STEPS[0];
  const progressPercent = Math.round(((activeCopilotStep + 1) / COPILOT_STEPS.length) * 100);

  const handleExecuteAction = () => {
    // 1. Navigate to appropriate tab if not already on it
    if (currentTab !== currentStepData.targetTab) {
      onNavigateTab(currentStepData.targetTab);
    }
    // 2. Trigger visual highlight spotlight
    if (currentStepData.highlightSelector) {
      triggerHighlight(currentStepData.highlightSelector);
    }
    // 3. Optional modal trigger
    if (currentStepData.id === 2) {
      onOpenLinkBank();
    }
  };

  const handleNextStep = () => {
    if (activeCopilotStep < COPILOT_STEPS.length - 1) {
      const nextStep = activeCopilotStep + 1;
      setActiveCopilotStep(nextStep);
      const nextStepData = COPILOT_STEPS[nextStep];
      if (nextStepData && nextStepData.targetTab !== currentTab) {
        onNavigateTab(nextStepData.targetTab);
      }
    }
  };

  const handlePrevStep = () => {
    if (activeCopilotStep > 0) {
      const prevStep = activeCopilotStep - 1;
      setActiveCopilotStep(prevStep);
      const prevStepData = COPILOT_STEPS[prevStep];
      if (prevStepData && prevStepData.targetTab !== currentTab) {
        onNavigateTab(prevStepData.targetTab);
      }
    }
  };

  // Minimized Floating Pill Mode
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in duration-200">
        <div className="flex items-center space-x-2 p-2 rounded-2xl bg-[#0B1B33]/95 backdrop-blur-xl border-2 border-[#FDE047]/50 shadow-2xl">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#06101E] text-white hover:text-[#FDE047] text-xs font-bold transition-colors"
          >
            <Compass className="w-4 h-4 text-[#FDE047] animate-spin-slow" />
            <span>Co-Pilot Step {activeCopilotStep + 1}/6</span>
            <span className="text-[10px] text-[#FDE047] font-mono">({progressPercent}%)</span>
          </button>

          <button
            onClick={handleExecuteAction}
            className="p-2 rounded-xl bg-[#FDE047] text-[#06101E] text-xs font-bold hover:bg-[#FEF08A] transition-colors"
            title="Spotlight Target Feature"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 text-[#9BB5D6] hover:text-white"
            title="Expand Co-Pilot"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Financial Co-Pilot Guidance"
      className="fixed bottom-5 right-4 z-40 w-[92vw] sm:w-[380px] p-5 rounded-3xl bg-[#0B1B33]/98 backdrop-blur-2xl border-2 border-[#FDE047]/40 shadow-[0_10px_40px_rgba(0,0,0,0.85)] animate-in slide-in-from-bottom-5 duration-300 flex flex-col justify-between select-none"
    >
      <div>
        {/* Top Co-Pilot Header & Activation Switch */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1E3352]">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FDE047] text-[#06101E] shadow-[0_0_12px_rgba(253,224,71,0.4)]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-black text-white tracking-tight">Interactive Co-Pilot</h4>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#2ECC71]/20 text-[#2ECC71] text-[9px] font-bold border border-[#2ECC71]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
              <p className="text-[10px] text-[#9BB5D6]">Step {activeCopilotStep + 1} of {COPILOT_STEPS.length} Workflow Guide</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-[#9BB5D6] hover:text-white hover:bg-[#0F2444] transition-colors"
              title="Minimize Co-Pilot"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCopilotActive(false)}
              className="p-1.5 rounded-lg text-[#9BB5D6] hover:text-[#FF4D6A] hover:bg-[#0F2444] transition-colors"
              title="Deactivate Co-Pilot"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-[#9BB5D6] font-semibold mb-1">
            <span>Onboarding Guidance Progress</span>
            <span className="text-[#FDE047] font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#0F2444] overflow-hidden">
            <div
              className="h-full bg-[#FDE047] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Current Step Content Card */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352] space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FDE047]/20 text-[#FDE047] text-[10px] font-black uppercase tracking-wider border border-[#FDE047]/30">
              {currentStepData.title.split('.')[0]}. Step
            </span>
            <h5 className="text-xs font-black text-white truncate">
              {currentStepData.title.split('. ')[1] || currentStepData.title}
            </h5>
          </div>

          <p className="text-xs text-[#C2D8F2] leading-relaxed">
            {currentStepData.details}
          </p>

          {/* Action Spotlight Button */}
          <div className="pt-2">
            <button
              onClick={handleExecuteAction}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FDE047] to-[#F5C842] hover:from-[#FEF08A] hover:to-[#FDE047] text-[#06101E] text-xs font-black flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(253,224,71,0.3)] transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#06101E]" />
              <span>{currentStepData.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tip Box */}
        <div className="mt-2.5 p-2.5 rounded-xl bg-[#0B1B33] border border-[#1E3352] text-[11px] text-[#9BB5D6] flex items-start space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FDE047] flex-shrink-0 mt-0.5" />
          <span>{currentStepData.tip}</span>
        </div>
      </div>

      {/* Step Navigation Controls Footer */}
      <div className="pt-3.5 mt-3 border-t border-[#1E3352] flex items-center justify-between gap-2">
        <button
          onClick={handlePrevStep}
          disabled={activeCopilotStep === 0}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeCopilotStep === 0
              ? 'opacity-40 cursor-not-allowed text-[#9BB5D6]'
              : 'bg-[#0F2444] text-white hover:bg-[#132E56] hover:text-[#FDE047]'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Step dots indicator */}
        <div className="flex items-center space-x-1">
          {COPILOT_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                setActiveCopilotStep(idx);
                if (step.targetTab !== currentTab) {
                  onNavigateTab(step.targetTab);
                }
              }}
              title={step.title}
              className={`w-2 h-2 rounded-full transition-all ${
                activeCopilotStep === idx
                  ? 'w-5 bg-[#FDE047]'
                  : idx < activeCopilotStep
                  ? 'bg-[#2ECC71]'
                  : 'bg-[#1E3352]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNextStep}
          disabled={activeCopilotStep === COPILOT_STEPS.length - 1}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeCopilotStep === COPILOT_STEPS.length - 1
              ? 'opacity-40 cursor-not-allowed text-[#9BB5D6]'
              : 'bg-[#0F2444] text-white hover:bg-[#132E56] hover:text-[#FDE047]'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
