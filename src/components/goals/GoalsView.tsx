import React, { useState } from 'react';
import {
  Target,
  Plus,
  Shield,
  Car,
  Plane,
  CreditCard,
  CheckCircle2,
  Calendar,
  Sparkles,
  DollarSign,
  TrendingUp,
  Trash2,
  Gift,
  Home,
  GraduationCap,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinanceContext } from '../../context/FinanceContext';
import { FinancialGoal } from '../../types';

interface GoalsViewProps {
  onOpenAddGoalModal: () => void;
}

const getGoalIcon = (iconName: string) => {
  switch (iconName) {
    case 'Shield':
    case 'security':
      return Shield;
    case 'Car':
    case 'directions-car':
      return Car;
    case 'Plane':
    case 'flight':
      return Plane;
    case 'CreditCard':
    case 'credit-card':
      return CreditCard;
    case 'Home':
    case 'home':
      return Home;
    case 'GraduationCap':
    case 'school':
      return GraduationCap;
    case 'Heart':
    case 'favorite':
      return Heart;
    default:
      return Target;
  }
};

export const GoalsView: React.FC<GoalsViewProps> = ({ onOpenAddGoalModal }) => {
  const { goals, contributeToGoal, deleteGoal, highlightedElementId } = useFinanceContext();
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [customDeposit, setCustomDeposit] = useState<string>('100');

  const handleDeposit = (id: string, amount: number) => {
    contributeToGoal(id, amount);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#FDE047', '#2ECC71', '#3D9EFF', '#A78BFA'],
    });
    setContributeGoalId(null);
  };

  const calculateDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div
        id="goals-section-header"
        className={`flex flex-wrap items-center justify-between gap-3 p-6 rounded-3xl bg-gradient-to-br from-[#0B1B33] via-[#0F2444] to-[#081528] border-2 border-[#FDE047]/30 shadow-xl transition-all duration-300 ${
          highlightedElementId === 'goals-section-header' ? 'ring-4 ring-[#FDE047] scale-[1.01] shadow-[0_0_30px_rgba(253,224,71,0.7)] animate-pulse' : ''
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#FDE047] text-[#06101E] shadow-[0_0_15px_rgba(253,224,71,0.4)]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Financial Targets & Milestones</h2>
            <p className="text-xs text-[#9BB5D6]">
              Set custom saving objectives, track completion pacing, and celebrate milestones
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddGoalModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black shadow-[0_0_18px_rgba(253,224,71,0.35)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal Target</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const Icon = getGoalIcon(goal.icon);
          const percent = Math.min((goal.current / goal.target) * 100, 100);
          const isCompleted = goal.current >= goal.target;
          const daysRemaining = calculateDaysLeft(goal.deadline);

          return (
            <div
              key={goal.id}
              className="relative p-6 rounded-3xl bg-[#0B1B33]/90 border border-[#1E3352] hover:border-[#FDE047]/40 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-3 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: `${goal.color}25`, color: goal.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{goal.title}</h3>
                      <div className="flex items-center space-x-1 text-[11px] text-[#9BB5D6] mt-0.5">
                        <Calendar className="w-3 h-3 text-[#FDE047]" />
                        <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Target reached'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-lg text-[#9BB5D6] hover:text-[#FF4D6A] hover:bg-[#06101E] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amount Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-white font-mono">
                      ${goal.current.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#9BB5D6] font-semibold">
                      Target: <strong className="text-[#FDE047]">${goal.target.toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-[#06101E] overflow-hidden p-0.5 border border-[#1E3352]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: isCompleted ? '#2ECC71' : goal.color,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#FDE047] font-mono">{percent.toFixed(0)}% Saved</span>
                    <span className="text-[#9BB5D6]">
                      ${(goal.target - goal.current > 0 ? goal.target - goal.current : 0).toLocaleString()} needed
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1E3352]">
                {contributeGoalId === goal.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={customDeposit}
                        onChange={e => setCustomDeposit(e.target.value)}
                        placeholder="Deposit amount"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#06101E] border border-[#FDE047] text-white font-mono focus:outline-none"
                      />
                      <button
                        onClick={() => handleDeposit(goal.id, parseFloat(customDeposit) || 0)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black shadow-sm"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => setContributeGoalId(null)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#0F2444] text-[#9BB5D6] text-xs hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeposit(goal.id, 50)}
                      className="flex-1 py-2 rounded-xl bg-[#06101E] hover:bg-[#0F2444] text-[#FDE047] hover:text-[#FEF08A] text-xs font-bold border border-[#1E3352] transition-colors"
                    >
                      +$50 Quick Add
                    </button>
                    <button
                      onClick={() => setContributeGoalId(goal.id)}
                      className="px-3 py-2 rounded-xl bg-[#0F2444] hover:bg-[#132E56] text-white text-xs font-bold border border-[#1E3352] transition-colors"
                    >
                      Custom Deposit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
