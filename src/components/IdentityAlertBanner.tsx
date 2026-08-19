import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';

export const IdentityAlertBanner: React.FC = () => {
  const { alerts, dismissAlert, markAllAlertsRead, highlightedElementId } = useFinanceContext();
  const unreadAlerts = alerts.filter(a => !a.read);

  if (unreadAlerts.length === 0) return null;

  const topAlert = unreadAlerts[0];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-[#FF4D6A]/15 border-[#FF4D6A]/40 text-[#FF4D6A]',
          badge: 'bg-[#FF4D6A] text-white',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          bg: 'bg-[#FF9A3C]/15 border-[#FF9A3C]/40 text-[#FF9A3C]',
          badge: 'bg-[#FF9A3C] text-white',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-[#FDE047]/15 border-[#FDE047]/40 text-[#FDE047]',
          badge: 'bg-[#FDE047] text-[#06101E]',
          icon: TrendingUp,
        };
    }
  };

  const style = getSeverityStyle(topAlert.severity);
  const Icon = style.icon;

  return (
    <div
      id="identity-alert-banner"
      className={`w-full border-b transition-all duration-300 ${style.bg} ${
        highlightedElementId === 'identity-alert-banner' ? 'ring-4 ring-[#FDE047] shadow-[0_0_25px_rgba(253,224,71,0.7)] animate-pulse' : ''
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="p-1.5 rounded-xl bg-black/30 flex-shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${style.badge}`}>
                {topAlert.severity} alert
              </span>
              <span className="text-xs font-bold text-white truncate">{topAlert.title}</span>
            </div>
            <p className="text-xs text-[#C2D8F2] truncate mt-0.5">{topAlert.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {unreadAlerts.length > 1 && (
            <span className="text-[11px] font-bold text-[#FDE047] mr-1">
              +{unreadAlerts.length - 1} more alerts
            </span>
          )}
          <button
            id={`btn-dismiss-alert-${topAlert.id}`}
            onClick={() => dismissAlert(topAlert.id)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0F2444] hover:bg-[#132E56] text-white border border-[#1E3352] transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span>Mark Resolved</span>
          </button>
          {unreadAlerts.length > 1 && (
            <button
              onClick={markAllAlertsRead}
              className="text-xs text-[#9BB5D6] hover:text-[#FDE047] underline px-2 py-1 font-semibold"
            >
              Dismiss All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
