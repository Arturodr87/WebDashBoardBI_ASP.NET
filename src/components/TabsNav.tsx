import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Truck,
  Plus,
  Layers,
} from 'lucide-react';
import { DashboardTab } from '../types';

interface TabsNavProps {
  tabs: DashboardTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  isAdmin: boolean;
  onAddNewTab: () => void;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  isAdmin,
  onAddNewTab,
}) => {
  const getTabIcon = (tabName: string) => {
    const lower = tabName.toLowerCase();
    if (lower.includes('resumen') || lower.includes('ejecutivo')) {
      return <LayoutDashboard className="w-4 h-4" />;
    }
    if (lower.includes('venta') || lower.includes('comercial')) {
      return <TrendingUp className="w-4 h-4" />;
    }
    if (lower.includes('logistica') || lower.includes('operacion')) {
      return <Truck className="w-4 h-4" />;
    }
    return <Layers className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200/90 mb-6 pb-2">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {getTabIcon(tab.name)}
              <span>{tab.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.kpis.length} KPIs
              </span>
            </button>
          );
        })}

        {/* Add View / Tab Button for Admin */}
        {isAdmin && (
          <button
            onClick={onAddNewTab}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-300 transition-colors"
            title="Agregar nueva vista al dashboard"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Vista</span>
          </button>
        )}
      </div>

      <div className="hidden lg:flex items-center text-xs text-slate-400 font-medium">
        <span>Vistas configurables de Business Intelligence</span>
      </div>
    </div>
  );
};
