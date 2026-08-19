import React, { useState } from 'react';
import { Target, X, Plus } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOAL_ICONS = ['Shield', 'Car', 'Plane', 'CreditCard', 'Home', 'GraduationCap', 'Heart'];
const GOAL_COLORS = ['#FDE047', '#2ECC71', '#3D9EFF', '#A78BFA', '#FF9A3C', '#FF4D6A'];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useFinanceContext();

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('0');
  const [deadline, setDeadline] = useState('2025-12-31');
  const [selectedIcon, setSelectedIcon] = useState('Shield');
  const [selectedColor, setSelectedColor] = useState('#FDE047');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVal = parseFloat(target);
    const currentVal = parseFloat(current) || 0;
    if (!title.trim() || isNaN(targetVal) || targetVal <= 0) return;

    addGoal({
      title: title.trim(),
      target: targetVal,
      current: currentVal,
      deadline,
      icon: selectedIcon,
      color: selectedColor,
    });

    setTitle('');
    setTarget('');
    setCurrent('0');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0B1B33] border-2 border-[#FDE047]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#9BB5D6] hover:text-white hover:bg-[#0F2444] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-[#FDE047] text-[#06101E] shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Create Saving Goal</h3>
            <p className="text-xs text-[#9BB5D6]">Define a milestone target and tracking date</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1">Goal Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Dream Vacation, House Downpayment"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white mb-1">Target Amount ($)</label>
              <input
                type="number"
                required
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder="5000"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">Current Saved ($)</label>
              <input
                type="number"
                value={current}
                onChange={e => setCurrent(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1">Target Completion Date</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">Accent Color</label>
            <div className="flex items-center space-x-2">
              {GOAL_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black shadow-[0_0_20px_rgba(253,224,71,0.35)] transition-all"
            >
              Save Goal Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
