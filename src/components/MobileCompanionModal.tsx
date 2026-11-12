import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  LayoutDashboard,
  Layers,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';
import { Dashboard, DashboardTab, UserProfile } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface MobileCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  dashboardsList: Dashboard[];
  currentDashboard: Dashboard;
  onSelectDashboard: (id: string) => void;
  onRefresh?: () => void;
}

export const MobileCompanionModal: React.FC<MobileCompanionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  dashboardsList,
  currentDashboard,
  onSelectDashboard,
  onRefresh,
}) => {
  const [selectedTabId, setSelectedTabId] = useState<string>('');
  const [showDashboardSelector, setShowDashboardSelector] = useState(false);
  const [isRefreshingMobile, setIsRefreshingMobile] = useState(false);
  const [mobileFilter, setMobileFilter] = useState('Mes Actual');

  if (!isOpen) return null;

  const activeDashboard = currentDashboard || dashboardsList[0];
  const activeTab: DashboardTab =
    activeDashboard?.tabs?.find((t) => t.id === selectedTabId) ||
    activeDashboard?.tabs?.[0];

  const handleRefresh = async () => {
    setIsRefreshingMobile(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshingMobile(false), 600);
  };

  // Sample data points for mobile chart based on active tab
  const getMobileChartData = (): any[] => {
    if (activeTab?.id === 'tab-empaque-hls') {
      return [
        { name: 'Latas', valor: 1454, hls: 13806, color: '#84CC16' },
        { name: 'Toneles', valor: 284, hls: 3854, color: '#0EA5E9' },
        { name: 'Botellas', valor: 162, hls: 416, color: '#F43F5E' },
        { name: 'Mat. Prom.', valor: 5, hls: 0, color: '#F59E0B' },
      ];
    }
    if (activeTab?.id === 'tab-marcas-clasifica') {
      return [
        { name: 'Cristal', value: 71.86, color: '#8B5CF6' },
        { name: 'Mayabe', value: 24.17, color: '#84CC16' },
        { name: 'Otro', value: 3.97, color: '#94A3B8' },
      ];
    }
    if (activeTab?.id === 'tab-ordenes-anios') {
      return [
        { mes: 'Ene', ordenes: 46947 },
        { mes: 'Mar', ordenes: 83118 },
        { mes: 'May', ordenes: 84046 },
        { mes: 'Jul', ordenes: 75717 },
        { mes: 'Sep', ordenes: 42940 },
        { mes: 'Nov', ordenes: 84090 },
      ];
    }
    if (activeTab?.id === 'tab-metas-2026') {
      return [
        { mes: 'Ene', valor: 2314, meta: 3000 },
        { mes: 'Abr', valor: 3552, meta: 3000 },
        { mes: 'Jun', valor: 2830, meta: 3000 },
        { mes: 'Ago', valor: 3349, meta: 3000 },
        { mes: 'Oct', valor: 3228, meta: 3000 },
        { mes: 'Nov', valor: 76, meta: 3000 },
      ];
    }
    // Default projects
    return [
      { mes: 'Ene', ordenes: 18 },
      { mes: 'Mar', ordenes: 28 },
      { mes: 'May', ordenes: 36 },
      { mes: 'Jul', ordenes: 48 },
      { mes: 'Sep', ordenes: 60 },
      { mes: 'Nov', ordenes: 82 },
    ];
  };

  const mobileChartData = getMobileChartData();

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative max-w-sm w-full">
        {/* Close Button Inside Viewport */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-2 text-white/90 hover:text-white p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 transition-colors z-50"
          title="Cerrar vista móvil"
          aria-label="Cerrar vista móvil"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Smartphone Hardware Frame */}
        <div className="w-[340px] mx-auto bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-white/20 select-none">
          {/* Dynamic Island / Speaker */}
          <div className="w-28 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          </div>

          {/* Smartphone Screen Canvas */}
          <div className="bg-[#F4F7FC] rounded-[36px] overflow-hidden text-slate-800 flex flex-col h-[650px] shadow-inner">
            {/* Top Status Bar */}
            <div className="bg-[#07162C] text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs">
              <span className="font-bold text-[11px]">9:41</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-emerald-400 font-semibold">5G • SQL</span>
                <span className="font-semibold">100%</span>
              </div>
            </div>

            {/* Mobile BI Header */}
            <div className="bg-[#07162C] text-white px-5 pb-4 pt-1 rounded-b-[24px] shadow-md border-b border-[#0f2a52]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <img
                      src="/assets/aistudio/cbsa_isotipo_cropped.png"
                      alt="CBSA"
                      className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold tracking-tight text-white leading-tight">
                      mi Cerveza BI
                    </h2>
                    <p className="text-[10px] text-blue-300">Visor Móvil de Dashboards</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshingMobile}
                    className="p-1.5 rounded-lg bg-[#0e274b] text-blue-300 hover:text-white transition-colors"
                    title="Actualizar datos"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isRefreshingMobile ? 'animate-spin text-amber-400' : ''}`}
                    />
                  </button>
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="Perfil"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/40"
                  />
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-0.5"
                    title="Cerrar modal"
                    aria-label="Cerrar modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dashboard Switcher Dropdown */}
              <div className="mt-3 relative">
                <button
                  onClick={() => setShowDashboardSelector(!showDashboardSelector)}
                  className="w-full bg-[#0c2242] hover:bg-[#102b54] text-white rounded-xl px-3 py-2 flex items-center justify-between text-left transition-all border border-blue-500/20"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <LayoutDashboard className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold truncate leading-tight">
                        {activeDashboard?.name || 'Dashboard'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {activeDashboard?.category || 'General'} • {activeDashboard?.tabs?.length || 0} vistas
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dashboard Options Dropdown Modal */}
                {showDashboardSelector && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#07162C] rounded-xl border border-slate-700 shadow-2xl py-1 z-30 max-h-48 overflow-y-auto">
                    <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Dashboards Disponibles
                    </p>
                    {(dashboardsList.length > 0 ? dashboardsList : [activeDashboard]).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          onSelectDashboard(d.id);
                          setSelectedTabId(d.tabs?.[0]?.id || '');
                          setShowDashboardSelector(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                          activeDashboard?.id === d.id
                            ? 'bg-blue-600/30 text-white font-bold'
                            : 'text-slate-300 hover:bg-[#0c2242]'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate leading-tight">{d.name}</p>
                          <p className="text-[10px] text-slate-400">{d.category}</p>
                        </div>
                        {activeDashboard?.id === d.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Views (Tabs) Selector Pill Bar */}
            <div className="bg-white border-b border-slate-200/80 px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
              {activeDashboard?.tabs?.map((tab) => {
                const isActive = (activeTab?.id || activeDashboard.tabs[0].id) === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTabId(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#1877F2] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {tab.kpis?.length || 3}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Body Content */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3.5">
              {/* Tab Description & Filter indicator */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span className="font-semibold text-slate-700 truncate max-w-[190px]">
                  {activeTab?.name || 'Vista Activa'}
                </span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                  {mobileFilter}
                </span>
              </div>

              {/* Mobile KPI Cards Carousel */}
              <div className="space-y-2">
                {activeTab?.kpis?.map((kpi, idx) => (
                  <div
                    key={kpi.id || idx}
                    className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {kpi.title}
                      </p>
                      <p className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5">
                        {kpi.value}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {kpi.subtitle || 'Actualizado en tiempo real'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                        <TrendingUp className="w-2.5 h-2.5" />
                        {kpi.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Interactive Chart */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {activeTab?.chart?.title || 'Visualización de Datos'}
                  </p>
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    Recharts
                  </span>
                </div>

                <div className="w-full h-44">
                  {activeTab?.id === 'tab-marcas-clasifica' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip />
                        <Pie
                          data={mobileChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {mobileChartData.map((e: any, i: number) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : activeTab?.id === 'tab-empaque-hls' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mobileChartData as any[]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                        <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                        <Tooltip />
                        <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                          {mobileChartData.map((e: any, i: number) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mobileChartData as any[]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#64748B' }} />
                        <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey={activeTab?.id === 'tab-metas-2026' ? 'valor' : 'ordenes'}
                          stroke="#1877F2"
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: '#1877F2' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Drilldown Table Summary */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <p className="text-[11px] font-bold text-slate-900 mb-2">
                  {activeTab?.tableQuery?.title || 'Registros SQL Server'}
                </p>
                <div className="space-y-1.5 text-[11px]">
                  {activeTab?.id === 'tab-empaque-hls' ? (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-slate-700">
                        <span>Latas</span>
                        <span className="font-bold text-emerald-600">$1,454,357.87</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-slate-700">
                        <span>Toneles</span>
                        <span className="font-bold text-blue-600">$284,327.18</span>
                      </div>
                      <div className="flex justify-between py-1 font-semibold text-slate-700">
                        <span>Botellas</span>
                        <span className="font-bold text-rose-600">$162,700.22</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-slate-700">
                        <span>Cristal (Líder)</span>
                        <span className="font-bold text-purple-600">71.86% Nto</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-slate-700">
                        <span>Mayabe</span>
                        <span className="font-bold text-emerald-600">24.17% Nto</span>
                      </div>
                      <div className="flex justify-between py-1 font-semibold text-slate-700">
                        <span>Otro</span>
                        <span className="font-bold text-slate-500">3.97% Nto</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom App Navigation Bar */}
            <div className="bg-white border-t border-slate-200 px-6 py-2.5 flex justify-between items-center text-[10px] text-slate-500">
              <button
                onClick={() => setShowDashboardSelector(true)}
                className="flex flex-col items-center text-blue-600 font-bold"
              >
                <LayoutDashboard className="w-4 h-4 mb-0.5" />
                <span>Dashboards</span>
              </button>
              <button
                onClick={() => {
                  const nextTab = activeDashboard?.tabs?.find((t) => t.id !== activeTab?.id);
                  if (nextTab) setSelectedTabId(nextTab.id);
                }}
                className="flex flex-col items-center hover:text-slate-800"
              >
                <Layers className="w-4 h-4 mb-0.5" />
                <span>Vistas</span>
              </button>
              <button
                onClick={() => {
                  setMobileFilter(mobileFilter === 'Mes Actual' ? 'Año 2026' : 'Mes Actual');
                }}
                className="flex flex-col items-center hover:text-slate-800"
              >
                <Filter className="w-4 h-4 mb-0.5" />
                <span>Filtrar</span>
              </button>
              <button
                onClick={handleRefresh}
                className="flex flex-col items-center hover:text-slate-800"
              >
                <RefreshCw className="w-4 h-4 mb-0.5" />
                <span>Refrescar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
