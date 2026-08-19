import React, { useState } from 'react';
import { Plus, X, DollarSign, Tag, Building2, Calendar } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, accounts, addTransaction } = useFinanceContext();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Dining');
  const [account, setAccount] = useState(accounts[0]?.name || 'Chase Checking');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!merchant.trim() || isNaN(val) || val <= 0) return;

    addTransaction({
      merchant: merchant.trim(),
      amount: val,
      category,
      account,
      date,
      flagged: false,
    });

    setMerchant('');
    setAmount('');
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
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Log New Expense</h3>
            <p className="text-xs text-[#9BB5D6]">Add a manual transaction to your topology</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1">Merchant / Description</label>
            <input
              type="text"
              required
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              placeholder="e.g. Whole Foods, Uber, Netflix"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">Paid From Account</label>
              <select
                value={account}
                onChange={e => setAccount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black shadow-[0_0_20px_rgba(253,224,71,0.35)] transition-all"
            >
              Add to Mind Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
