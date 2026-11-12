import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FolderKanban,
  Users,
  CreditCard,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendPositive?: boolean;
  subtitle?: string;
  iconType?: 'projects' | 'clients' | 'revenue' | 'sales' | 'buyers' | 'default';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  trendPositive = true,
  subtitle,
  iconType = 'default',
  onClick,
}) => {
  // Select icon matching the corporate context
  const getIcon = () => {
    switch (iconType) {
      case 'projects':
        return <FolderKanban className="w-5 h-5 text-blue-600" />;
      case 'clients':
        return <Users className="w-5 h-5 text-indigo-600" />;
      case 'revenue':
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case 'sales':
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'buyers':
        return <ShoppingBag className="w-5 h-5 text-cyan-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIconBg = () => {
    switch (iconType) {
      case 'projects':
        return 'bg-blue-50 ring-1 ring-blue-100';
      case 'clients':
        return 'bg-indigo-50 ring-1 ring-indigo-100';
      case 'revenue':
        return 'bg-emerald-50 ring-1 ring-emerald-100';
      case 'sales':
        return 'bg-amber-50 ring-1 ring-amber-100';
      case 'buyers':
        return 'bg-cyan-50 ring-1 ring-cyan-100';
      default:
        return 'bg-slate-50 ring-1 ring-slate-100';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group cursor-default"
    >
      {/* Top Header: Title & Subtle Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-wide">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${getIconBg()}`}>
          {getIcon()}
        </div>
      </div>

      {/* Big KPI Metric */}
      <div className="my-3">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>

      {/* Trend & Subtitle matching the reference image */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              trendPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            {trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>{trend}</span>
          </div>
        </div>

        {subtitle && (
          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
