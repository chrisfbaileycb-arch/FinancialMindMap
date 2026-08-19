import React, { useState } from 'react';
import { Building2, X, CheckCircle2, ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

interface PlaidLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_BANKS = [
  { name: 'Chase', logo: '🏛️', color: '#117ACA' },
  { name: 'Bank of America', logo: '🏦', color: '#E31837' },
  { name: 'Wells Fargo', logo: '🪙', color: '#D71E28' },
  { name: 'Capital One', logo: '💳', color: '#004879' },
  { name: 'Fidelity Investments', logo: '📈', color: '#4E8B2C' },
  { name: 'Vanguard', logo: '⚓', color: '#971B2F' },
  { name: 'Charles Schwab', logo: '💼', color: '#00A3E0' },
  { name: 'Citi', logo: '🌐', color: '#003B70' },
];

export const PlaidLinkModal: React.FC<PlaidLinkModalProps> = ({ isOpen, onClose }) => {
  const { linkInstitution } = useFinanceContext();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [customBankName, setCustomBankName] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async (bankName: string) => {
    setIsConnecting(true);
    // Simulate Plaid secure OAuth handshake
    await new Promise(resolve => setTimeout(resolve, 900));
    linkInstitution(bankName);
    setIsConnecting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedBank(null);
      setCustomBankName('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0B1B33] border-2 border-[#FDE047]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#9BB5D6] hover:text-white hover:bg-[#0F2444] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30 shadow-[0_0_20px_rgba(46,204,113,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-white">Connection Established!</h3>
            <p className="text-xs text-[#9BB5D6]">
              Bank accounts synchronized and transactions added to your mind map topology.
            </p>
          </div>
        ) : isConnecting ? (
          <div className="py-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FDE047] text-[#06101E] shadow-[0_0_20px_rgba(253,224,71,0.4)] animate-pulse">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">Establishing Secure Plaid Pipeline</h3>
            <p className="text-xs text-[#9BB5D6]">
              Authenticating credentials via 256-bit encrypted token exchange...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-[#FDE047] text-[#06101E] shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Connect Financial Institution</h3>
                <p className="text-xs text-[#9BB5D6]">Select your bank or enter provider name</p>
              </div>
            </div>

            {/* Popular Grid */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {POPULAR_BANKS.map(bank => (
                <button
                  key={bank.name}
                  onClick={() => handleConnect(bank.name)}
                  className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#06101E] border border-[#1E3352] hover:border-[#FDE047]/60 hover:bg-[#0F2444] transition-all text-left group"
                >
                  <span className="text-lg">{bank.logo}</span>
                  <span className="text-xs font-bold text-white group-hover:text-[#FDE047] truncate">
                    {bank.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Bank Name Input */}
            <div className="pt-3 border-t border-[#1E3352]">
              <div className="text-xs text-[#9BB5D6] font-bold mb-1.5">Or search custom provider:</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customBankName}
                  onChange={e => setCustomBankName(e.target.value)}
                  placeholder="e.g. Ally Bank, Discover..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
                />
                <button
                  onClick={() => customBankName.trim() && handleConnect(customBankName.trim())}
                  disabled={!customBankName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black transition-all disabled:opacity-40"
                >
                  Link
                </button>
              </div>
            </div>

            {/* Privacy Badge */}
            <div className="p-3 rounded-2xl bg-[#06101E]/60 border border-[#1E3352] flex items-center space-x-2 text-[11px] text-[#9BB5D6]">
              <ShieldCheck className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
              <span>We never store banking passwords or login credentials. Read-only tokenized sync.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
