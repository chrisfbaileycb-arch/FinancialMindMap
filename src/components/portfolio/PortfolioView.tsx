import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Info,
  DollarSign,
} from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

const HOLDING_COLORS = ['#FDE047', '#3D9EFF', '#2ECC71', '#A78BFA'];

export const PortfolioView: React.FC = () => {
  const { portfolio } = useFinanceContext();
  const isPositive = portfolio.dayChange >= 0;

  return (
    <div className="space-y-6 w-full">
      {/* Portfolio Value Hero */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1B33] via-[#0F2444] to-[#081528] border-2 border-[#FDE047]/30 shadow-[0_0_30px_rgba(253,224,71,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#9BB5D6]">
                Total Invested Holdings Value
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FDE047]/15 text-[#FDE047] border border-[#FDE047]/30">
                Asset Allocation
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1.5">
              ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border font-mono font-black text-xs ${
              isPositive
                ? 'bg-[#2ECC71]/15 border-[#2ECC71]/40 text-[#2ECC71]'
                : 'bg-[#FF4D6A]/15 border-[#FF4D6A]/40 text-[#FF4D6A]'
            }`}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPositive ? '+' : ''}${portfolio.dayChange.toFixed(2)} ({isPositive ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%) Today
            </span>
          </div>
        </div>

        {/* Multi-Segment Allocation Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-[#9BB5D6] font-bold mb-2">
            <span>Portfolio Weight Distribution</span>
            <span className="text-[#FDE047]">100% Target Match</span>
          </div>
          <div className="flex h-3.5 rounded-full overflow-hidden bg-[#06101E] p-0.5 space-x-0.5 border border-[#1E3352]">
            {portfolio.holdings.map((holding, i) => (
              <div
                key={holding.id}
                style={{
                  width: `${holding.allocation}%`,
                  backgroundColor: HOLDING_COLORS[i % HOLDING_COLORS.length],
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 relative group cursor-pointer"
                title={`${holding.name}: ${holding.allocation}%`}
              />
            ))}
          </div>

          {/* Allocation Legend */}
          <div className="flex flex-wrap gap-4 mt-3">
            {portfolio.holdings.map((holding, i) => (
              <div key={holding.id} className="flex items-center space-x-1.5 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: HOLDING_COLORS[i % HOLDING_COLORS.length] }}
                />
                <span className="font-bold text-white">{holding.name.split(' ')[0]}</span>
                <span className="text-[#9BB5D6] font-mono">({holding.allocation}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolio.holdings.map((holding, i) => {
          const isHoldingPos = holding.change >= 0;
          return (
            <div
              key={holding.id}
              className="p-5 rounded-3xl bg-[#0B1B33]/90 border border-[#1E3352] hover:border-[#FDE047]/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: HOLDING_COLORS[i % HOLDING_COLORS.length] }}
                    />
                    <div>
                      <h4 className="text-sm font-black text-white">{holding.name}</h4>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#9BB5D6]">
                        {holding.ticker}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#FDE047] font-mono px-2 py-0.5 rounded-lg bg-[#06101E] border border-[#1E3352]">
                    {holding.allocation}% Weight
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1E3352]">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#9BB5D6]">Total Value</div>
                    <div className="text-base font-black text-white font-mono mt-0.5">
                      ${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#9BB5D6]">Performance</div>
                    <div
                      className={`text-base font-black font-mono mt-0.5 ${
                        isHoldingPos ? 'text-[#2ECC71]' : 'text-[#FF4D6A]'
                      }`}
                    >
                      {isHoldingPos ? '+' : ''}${holding.change.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E3352]/70 flex items-center justify-between text-[11px] text-[#9BB5D6]">
                <span>Ticker: {holding.ticker}</span>
                <span className="text-[#FDE047] font-bold">Allocated Weight: {holding.allocation}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
