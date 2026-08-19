import React, { useState } from 'react';
import {
  Network,
  ShieldCheck,
  Zap,
  TrendingUp,
  Target,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Sliders,
  DollarSign,
  PieChart,
  Eye,
  EyeOff,
  UserCheck,
  ChevronRight,
  HelpCircle,
  Clock,
  Compass,
  FileSpreadsheet,
  Cpu,
  RefreshCw,
  Award,
  Smartphone,
  BarChart3,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Check
} from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';
import { NavigationTab } from '../../types';

interface CoverPageProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenLinkBank: () => void;
  onOpenAddTx: () => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  onNavigateTab,
  onOpenLinkBank,
  onOpenAddTx,
}) => {
  const { totalBalance, categories, goals, isAuthenticated, toggleAuth, loadSampleProfile } = useFinanceContext();

  // Auth Form State (Sign Up vs Log In)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign Up Form Fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupGoal, setSignupGoal] = useState('Track Cash Flow & Mind Map');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Log In Form Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Active FAQ / Instruction Accordion
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'Enter password', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, text: 'Good', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong (AES-256 Vault Ready)', color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength(signupPassword);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setAuthMessage('Please fill in all required fields to create your account.');
      return;
    }
    setSignupSuccess(true);
    setAuthMessage(`Welcome, ${signupName}! Your Financial Mind Map profile has been initialized.`);
    setTimeout(() => {
      onNavigateTab('mindmap');
    }, 1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthMessage('Please enter your email and password.');
      return;
    }
    setLoginSuccess(true);
    setAuthMessage('Sign in successful. Unlocking your financial topology...');
    setTimeout(() => {
      onNavigateTab('mindmap');
    }, 1000);
  };

  const handleQuickDemoLogin = (profileKey: string, personaName: string, personaEmail: string) => {
    loadSampleProfile(profileKey);
    setLoginEmail(personaEmail);
    setLoginPassword('••••••••••••');
    setLoginSuccess(true);
    setAuthMessage(`Loaded sample profile for ${personaName}. Directing to Mind Map...`);
    setTimeout(() => {
      onNavigateTab('mindmap');
    }, 800);
  };

  return (
    <div id="cover-page-root" className="w-full bg-white text-slate-900 font-sans selection:bg-amber-200 selection:text-slate-900">
      
      {/* Top Cover Sticky Sub-Navigation */}
      <div className="sticky top-16 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-sm">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">
                FinancialMindMap <span className="text-amber-500">Cover & Guide</span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Visual Cashflow Topology, Instructions, Strengths & Honest Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href="#auth-section"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Sign Up / Log In
            </a>
            <a
              href="#instructions-section"
              className="hidden md:inline-block px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Instructions
            </a>
            <a
              href="#steps-section"
              className="hidden lg:inline-block px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Steps
            </a>
            <a
              href="#features-section"
              className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Features
            </a>
            <a
              href="#strengths-section"
              className="hidden xl:inline-block px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Strengths & Weaknesses
            </a>
            <button
              onClick={() => onNavigateTab('mindmap')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm hover:shadow transition-all"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-20 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Next-Generation Visual Wealth & Budgeting Experience</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                See Your Entire Financial Universe in a <span className="underline decoration-amber-400 decoration-4 underline-offset-4">Living Mind Map</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Ditch the spreadsheet anxiety. FinancialMindMap transforms cold rows of numbers into an intuitive orbital topology. Watch your cashflow pulse, spot phantom spending leaks instantly, and accelerate your wealth milestones with subconscious clarity.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit Encrypted Sandbox</span>
                </div>
                <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Real-Time Node Physics</span>
                </div>
                <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Zero Data Resale Guarantee</span>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <a
                  href="#auth-section"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onNavigateTab('mindmap')}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Network className="w-4 h-4" />
                  <span>Explore Interactive Mind Map</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left">
                <div>
                  <div className="text-2xl font-black text-slate-900">$420/mo</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Average User Leak Savings</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">12,000+</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Banks & Institutions</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Visual Spatial Intuition</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-500 ml-1">Live Financial Topology</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Active System
                  </span>
                </div>

                {/* Simulated Mind Map Mini-Visual */}
                <div className="relative h-56 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                  {/* Central Node */}
                  <div className="z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full bg-slate-900 text-white shadow-lg text-center p-2 border-4 border-amber-400">
                    <span className="text-[9px] uppercase font-extrabold text-amber-400">Net Cashflow</span>
                    <span className="text-sm font-black font-mono mt-0.5">$3,420</span>
                    <span className="text-[8px] text-slate-300">Monthly Burn</span>
                  </div>

                  {/* Orbiting Satellite Bubbles */}
                  <div className="absolute top-4 left-6 flex flex-col items-center justify-center w-18 h-18 rounded-full bg-blue-50 border-2 border-blue-400 text-slate-900 text-center p-1 shadow-sm">
                    <span className="text-[9px] font-black text-blue-700">Housing</span>
                    <span className="text-[10px] font-extrabold font-mono">$1,850</span>
                  </div>

                  <div className="absolute top-4 right-6 flex flex-col items-center justify-center w-18 h-18 rounded-full bg-rose-50 border-2 border-rose-400 text-slate-900 text-center p-1 shadow-sm animate-pulse">
                    <span className="text-[9px] font-black text-rose-700">Dining</span>
                    <span className="text-[10px] font-extrabold font-mono text-rose-600">$680 ⚠️</span>
                  </div>

                  <div className="absolute bottom-4 left-8 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 text-slate-900 text-center p-1 shadow-sm">
                    <span className="text-[9px] font-black text-emerald-700">Savings</span>
                    <span className="text-[10px] font-extrabold font-mono">$500</span>
                  </div>

                  <div className="absolute bottom-4 right-8 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-400 text-slate-900 text-center p-1 shadow-sm">
                    <span className="text-[9px] font-black text-amber-700">Travel</span>
                    <span className="text-[10px] font-extrabold font-mono">$320</span>
                  </div>

                  {/* Radial Orbit Circles */}
                  <div className="absolute inset-4 rounded-full border border-dashed border-slate-300 pointer-events-none" />
                </div>

                {/* Micro Action Box */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Try Interactive Simulation</h4>
                    <p className="text-[11px] text-slate-600">Drag nodes, log mock transactions, and test budget limits.</p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('mindmap')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs transition-colors flex-shrink-0"
                  >
                    Open Canvas
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 1 & 2: SIGN UP & LOG IN (INTERACTIVE TABBED COMPONENT) */}
      <section id="auth-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-800">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Authentication & Access Portal</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Sign Up or Log In to Your Financial Universe
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create a personalized financial profile to sync bank accounts, track category limits, and visualize your wealth in real time.
            </p>
          </div>

          {/* Tab Switcher Card */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
            
            {/* Header Tabs */}
            <div className="grid grid-cols-2 bg-slate-100 p-2 gap-2 border-b border-slate-200">
              <button
                id="btn-tab-signup"
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthMessage(null);
                }}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Create New Account (Sign Up)</span>
              </button>

              <button
                id="btn-tab-login"
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthMessage(null);
                }}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Sign In (Log In)</span>
              </button>
            </div>

            {/* Notification message */}
            {authMessage && (
              <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-slate-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{authMessage}</span>
              </div>
            )}

            {/* SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="signup-fullname"
                      type="text"
                      placeholder="e.g. Alex Mercer"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="alex.mercer@example.com"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Master Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create strong password"
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {signupPassword && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                          <span>Security Strength:</span>
                          <span className={passStrength.score >= 2 ? 'text-emerald-700' : 'text-amber-700'}>
                            {passStrength.text}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 rounded-full ${passStrength.score >= 1 ? passStrength.color : 'bg-slate-200'}`} />
                          <div className={`h-full flex-1 rounded-full ${passStrength.score >= 2 ? passStrength.color : 'bg-slate-200'}`} />
                          <div className={`h-full flex-1 rounded-full ${passStrength.score >= 3 ? passStrength.color : 'bg-slate-200'}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Primary Financial Focus
                    </label>
                    <select
                      id="signup-focus"
                      value={signupGoal}
                      onChange={e => setSignupGoal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    >
                      <option value="Track Cash Flow & Mind Map">Track Cash Flow & Mind Map</option>
                      <option value="Eliminate High-Interest Debt">Eliminate High-Interest Debt</option>
                      <option value="Build $10k+ Emergency Cushion">Build $10k+ Emergency Cushion</option>
                      <option value="Accelerate Stock Portfolio">Accelerate Stock Portfolio</option>
                      <option value="Identify Phantom Subscriptions">Identify Phantom Subscriptions</option>
                    </select>
                  </div>
                </div>

                {/* Terms agreement */}
                <label className="flex items-start space-x-2.5 cursor-pointer pt-1">
                  <input
                    id="signup-terms-checkbox"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    I agree to the <strong className="text-slate-900">Encrypted Privacy Policy</strong> and understand that FinancialMindMap operates with client-side zero-knowledge isolation.
                  </span>
                </label>

                {/* Form Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    id="btn-submit-signup"
                    type="submit"
                    disabled={signupSuccess}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{signupSuccess ? 'Account Initialized!' : 'Complete Sign Up & Launch'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('balanced', 'Sarah Chen', 'sarah.chen@demo.finance')}
                    className="py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>One-Click Demo Sign In</span>
                  </button>
                </div>
              </form>
            )}

            {/* LOG IN FORM */}
            {authMode === 'login' && (
              <div className="p-6 sm:p-8 space-y-6">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Email Address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="alex.mercer@example.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered email address.')}
                        className="text-xs text-amber-600 hover:text-amber-700 font-bold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        id="login-remember-checkbox"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
                      />
                      <span className="text-xs text-slate-600 font-medium">Remember on this device</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('balanced', 'Biometric User', 'faceid.auth@demo.finance')}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>FaceID / TouchID</span>
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      id="btn-submit-login"
                      type="submit"
                      disabled={loginSuccess}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Unlock className="w-4 h-4 text-amber-400" />
                      <span>{loginSuccess ? 'Access Granted...' : 'Sign In to Mind Map'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('balanced', 'Demo Investor', 'demo.investor@mindmap.finance')}
                      className="py-3.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Instant Demo Access</span>
                    </button>
                  </div>
                </form>

                {/* Instant Persona Selector */}
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block mb-2">
                    Or select a pre-configured sample persona:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('balanced', 'Alex (Tech Professional)', 'alex.tech@demo.finance')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-900">Alex • Tech Lead</div>
                      <div className="text-[10px] text-slate-500">$52.8k Net Worth • Balanced</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('debt_accelerator', 'Taylor (Debt Snowball)', 'taylor.snowball@demo.finance')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-900">Taylor • Debt Payoff</div>
                      <div className="text-[10px] text-slate-500">Accelerated Paydown Path</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('fire_accumulator', 'Jordan (FIRE Accumulator)', 'jordan.fire@demo.finance')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-900">Jordan • FIRE Seeker</div>
                      <div className="text-[10px] text-slate-500">$186k Net Worth • 65% Savings</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* SECTION 3: INSTRUCTIONS */}
      <section id="instructions-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Comprehensive User Instructions</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              How to Master FinancialMindMap
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Everything you need to know about navigating the spatial canvas, connecting institutions, reading color-coded health signals, and configuring wealth goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Instruction Card 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-sm shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">1. Canvas Navigation & Drag Controls</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The mind map is fully interactive. Click and drag the blank background to <strong>pan</strong>. Use your mouse scroll or the top toolbar zoom buttons to zoom in and out. You can also click and drag any category bubble to reposition it anywhere on the orbital plane.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                💡 <strong className="text-slate-900">Pro-Tip:</strong> Click the "Recenter" button in the canvas controls to instantly restore the radial orbit layout.
              </div>
            </div>

            {/* Instruction Card 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 font-black flex items-center justify-center text-sm shadow-xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">2. Reading Bubble Sizes & Pulsing Signals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bubble radii expand dynamically as spending grows relative to other categories. If a category exceeds 100% of its designated budget, it automatically pulses with a red warning halo to alert you before month-end.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                ⚡ <strong className="text-slate-900">Visual Rule:</strong> Green = Under Budget (&lt;80%), Amber = Nearing Limit (80-100%), Red = Overspent.
              </div>
            </div>

            {/* Instruction Card 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm shadow-xs">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">3. Ledger Drawer & Budget Sliders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clicking any category bubble opens its dedicated <strong>Detail Drawer</strong>. Here, you can adjust monthly budget targets via interactive sliders, view itemized transactions, flag suspicious charges, or log quick expenses.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                📊 <strong className="text-slate-900">Central Hub:</strong> Clicking the central sphere opens the macro cashflow ledger with category rankings.
              </div>
            </div>

            {/* Instruction Card 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">4. Creating & Accelerating Goals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Navigate to the <strong>Goals</strong> tab to set up milestones (Emergency Fund, Vacation, Car, House Down Payment). Use the one-click "+$100" or "+$250" buttons to simulate contributions and watch completion estimates adjust.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                🎯 <strong className="text-slate-900">Velocity:</strong> The system computes exact monthly deposits required to finish by your deadline.
              </div>
            </div>

            {/* Instruction Card 5 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 font-black flex items-center justify-center text-sm shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">5. Identity & Anomaly Alerts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The top alert banner continuously checks for price hikes in recurring subscriptions (e.g. Netflix, Spotify), duplicate charges, and unusual transaction spikes so you never pay for unwanted charges.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                🛡️ <strong className="text-slate-900">Action:</strong> Dismiss read alerts or inspect merchants with a single click.
              </div>
            </div>

            {/* Instruction Card 6 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-sm shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">6. Wealth Calculators in Learn Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visit the <strong>Learn</strong> tab to access our interactive Compound Interest growth modeler, Debt Snowball payoff visualizer, and Rule of 72 doubling timeline calculator.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                📈 <strong className="text-slate-900">Simulation:</strong> Tweak contributions and rates to visualize your 30-year net worth curve.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: STEPS BROKEN DOWN (SEQUENTIAL ROADMAP) */}
      <section id="steps-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Step-by-Step Onboarding Roadmap</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              4 Simple Steps to Financial Freedom
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Follow this clear sequence from initial bank aggregation to automated compound wealth building.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-8 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-amber-400 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-sm">
                      01
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                      ~30 Seconds
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">Connect Institutions</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click <strong>"Link Bank"</strong> in the top header. Select Chase, Bank of America, Fidelity, Vanguard, or your local credit union to securely pull balances and recent charges into the local sandbox.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onNavigateTab('mindmap');
                      setTimeout(onOpenLinkBank, 300);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
                  >
                    Link First Account
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-amber-400 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-black text-lg flex items-center justify-center shadow-sm">
                      02
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                      ~1 Minute
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">Tune Category Orbits</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click your primary spending nodes (Housing, Groceries, Dining, Subscriptions) and drag the budget slider to set realistic monthly allowances based on your take-home pay.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateTab('mindmap')}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
                  >
                    Configure Budgets
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-amber-400 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-sm">
                      03
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                      Daily Glance
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">Monitor Spatial Signals</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Spend 15 seconds reviewing your topology weekly. If bubbles expand excessively or pulse with red warning rings, prune discretionary dining and shopping before the cycle closes.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateTab('dashboard')}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
                  >
                    View Cashflow Feed
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-amber-400 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center shadow-sm">
                      04
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Automated
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">Compound Milestones</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Funnel surplus monthly cashflow toward high-yield savings goals and diversified investment portfolios. Watch your compound return curve grow exponentially year over year.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateTab('goals')}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
                  >
                    Check Goals & Milestones
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: FEATURES */}
      <section id="features-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Full Capability Matrix</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Engineered for Complete Wealth Mastery
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Discover the deep features that make FinancialMindMap far superior to traditional rigid budgeting apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 w-fit font-black">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Orbital 2D Mind Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smooth drag, zoom, pan canvas with radial category waypoints and proportional physics scaling based on live burn rates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-900 w-fit font-black">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Live Bank Sync Sandbox</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect checking, savings, high-yield accounts, credit cards, and investments with instantaneous one-click sync refresh.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-900 w-fit font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Stealth Leak Detector</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proactive anomaly monitors spot hidden subscription rate increases, duplicate charges, and unusual merchant spikes automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 w-fit font-black">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Target Velocity Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual progress dials for Emergency Funds, Down Payments, and Vacations with exact required monthly deposit pacing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-purple-100 text-purple-900 w-fit font-black">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Portfolio Weightings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track diversified equity holdings, index funds, and crypto asset allocations with real-time performance indicators.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 w-fit font-black">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Compound Calculators</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive growth modelers, Rule of 72 doubling timelines, and Debt Snowball payoff visualizers directly built in.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-900 w-fit font-black">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Full-Screen Overlay</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Expand the mind map to edge-to-edge full screen with fast category filters (All, Overspent, Top Spenders) for distraction-free focus.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-teal-100 text-teal-900 w-fit font-black">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Session Privacy Shield</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-click session lock to mask sensitive financial amounts when working in coffee shops, offices, or public spaces.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6 & 7: STRENGTHS & WEAKNESSES (HONEST & BALANCED COMPARISON) */}
      <section id="strengths-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-800">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Transparent & Objective Analysis</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Strengths & Honest Limitations
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We believe in total transparency. Here is an authentic breakdown of where FinancialMindMap excels and where other tools might be better suited.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* STRENGTHS COLUMN */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/50 border-2 border-emerald-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-emerald-200">
                <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-xs">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Core Strengths & Advantages</h3>
                  <p className="text-xs text-emerald-800 font-medium">Why users retain more wealth with visual topology</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-emerald-200 text-emerald-800 mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 font-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Immediate Spatial Intuition (60,000x Faster)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      The human brain processes visual size and color instantly. You subconsciously recognize high-burn categories without calculating cell sums.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-emerald-200 text-emerald-800 mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 font-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Zero Spreadsheet Burnout or Manual Entry</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      No broken formulas, no tabular clutter. Automated bank imports and visual slider controls turn weekly reviews into an enjoyable 60-second routine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-emerald-200 text-emerald-800 mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 font-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Unified Asset & Debt Ecosystem</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Both your liabilities (credit cards, loans) and wealth assets (savings, 401ks, equities) are visualized in one harmonious network.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-emerald-200 text-emerald-800 mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 font-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Client-First Privacy & Zero-Knowledge Isolation</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      We never sell marketing profiles, advertise payday loans, or monetize your spending data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WEAKNESSES & LIMITATIONS COLUMN */}
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/50 border-2 border-amber-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-amber-200">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Limitations & Honest Weaknesses</h3>
                  <p className="text-xs text-amber-900 font-medium">Clear expectations and recommended workarounds</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-amber-200 text-amber-900 mt-0.5 flex-shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Initial Paradigm Shift for Spreadsheet Traditionalists</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Users accustomed to dense, tabular Excel sheets may need 2–3 days to get comfortable with radial mind mapping. <em className="text-slate-500 font-normal">(Workaround: Use the Dashboard Tab for tabular ledger views anytime.)</em>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-amber-200 text-amber-900 mt-0.5 flex-shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Not Built for High-Frequency Day Trading</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      FinancialMindMap is designed for personal wealth accumulation and budget mastery, not second-by-second stock options or order routing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-amber-200 text-amber-900 mt-0.5 flex-shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Mobile Canvas Density with 20+ Categories</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      On narrow 375px phone screens, navigating 20+ simultaneous bubbles requires pinch-to-zoom or using the dedicated mobile card feeds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-amber-200 text-amber-900 mt-0.5 flex-shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Regional Credit Union Sync Latency</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      While major national banks refresh in real time, some smaller regional institutions batch transaction webhooks every 12 to 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION (FRESH & CRISP) */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 text-xs font-black">
            <Sparkles className="w-4 h-4" />
            <span>Start Visualizing Your Money Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to Take Command of Your Financial Topology?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join thousands of individuals and families who eliminated financial fog and gained effortless clarity over their cashflow, debt, and wealth growth.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigateTab('mindmap')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(253,224,71,0.35)] transition-all flex items-center justify-center space-x-2"
            >
              <Network className="w-5 h-5" />
              <span>Launch Financial Mind Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#auth-section"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Create / Switch Account</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-amber-400 text-slate-950 font-bold">
              <Network className="w-3.5 h-3.5" />
            </div>
            <span className="font-black text-slate-900">FinancialMindMap</span>
            <span>— Visual Wealth & Cashflow Topology Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigateTab('mindmap')}
              className="text-slate-700 hover:text-amber-600 font-bold"
            >
              Mind Map
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="text-slate-700 hover:text-amber-600 font-bold"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigateTab('goals')}
              className="text-slate-700 hover:text-amber-600 font-bold"
            >
              Goals
            </button>
            <button
              onClick={() => onNavigateTab('learn')}
              className="text-slate-700 hover:text-amber-600 font-bold"
            >
              Learn
            </button>
            <span>• 100% Mock Sandbox Safe</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
