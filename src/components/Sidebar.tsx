import React from 'react';
import {
  Home,
  FolderKanban,
  Users,
  BarChart3,
  Settings,
  Database,
  ShieldCheck,
  Smartphone,
  PlusCircle,
  Layers,
  ChevronRight,
  Menu,
  Server,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: UserProfile | null;
  onOpenMobilePreview: () => void;
  onOpenSqlConsole: () => void;
  onOpenLdapConfig: () => void;
  onOpenNewDashboardModal: () => void;
  onOpenAspNetCoreArchitecture?: () => void;
  sqlStatusConnected: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenMobilePreview,
  onOpenSqlConsole,
  onOpenLdapConfig,
  onOpenNewDashboardModal,
  onOpenAspNetCoreArchitecture,
  sqlStatusConnected,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const isAdmin = currentUser?.role === 'Admin';

  const mainNavItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'proyectos', label: 'Proyectos', icon: FolderKanban },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-[#07162C] text-slate-300 flex flex-col h-screen shrink-0 border-r border-[#0e274b] select-none transition-all duration-300 ease-in-out relative z-30 overflow-x-hidden`}
    >
      {/* Brand Header with Hamburger Toggle */}
      <div
        className={`h-24 flex items-center border-b border-[#0f2a52] transition-all duration-300 ${
          isCollapsed ? 'flex-col justify-center px-2 py-3 gap-1.5' : 'justify-between px-5'
        }`}
      >
        {isCollapsed ? (
          <>
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl text-blue-400 hover:text-white hover:bg-[#0c2242] transition-colors focus:outline-none"
              title="Expandir barra lateral"
              aria-label="Expandir barra lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/cbsa_isotipo_cropped.png"
                alt="Isotipo"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 min-w-0 pr-2">
              <img
                src="/assets/aistudio/logo_cbsa_sidebar_2x.png"
                alt="mi Cerveza - Cervecería Bucanero S.A."
                className="max-h-12 w-auto max-w-[165px] object-contain select-none filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
              />
            </div>
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#0c2242] transition-colors shrink-0 focus:outline-none"
              title="Colapsar barra lateral (ampliar dashboard)"
              aria-label="Colapsar barra lateral"
            >
              <Menu className="w-5 h-5 text-slate-300 hover:text-white" />
            </button>
          </>
        )}
      </div>

      {/* Main Navigation matching the photo */}
      <div className={`flex-1 overflow-y-auto space-y-6 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-6'}`}>
        <div>
          {!isCollapsed && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2.5">
              Navegación
            </p>
          )}
          <nav className="space-y-1.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                    isCollapsed ? 'justify-center p-2.5' : 'gap-3.5 px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#1877F2] text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#0c2242]'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Tools */}
        {isAdmin && (
          <div className="pt-2 border-t border-[#0f2a52]">
            {!isCollapsed ? (
              <div className="flex items-center justify-between px-3 mb-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Herramientas BI Admin
                </p>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                  ADMIN
                </span>
              </div>
            ) : (
              <div className="w-full flex justify-center mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Herramientas Admin" />
              </div>
            )}
            <div className="space-y-1.5">
              <button
                onClick={onOpenNewDashboardModal}
                title={isCollapsed ? 'Nuevo Dashboard' : undefined}
                className={`w-full flex items-center rounded-xl text-sm font-medium text-slate-200 hover:bg-[#0c2242] transition-colors group ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <PlusCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  {!isCollapsed && <span>Nuevo Dashboard</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                )}
              </button>

              <button
                onClick={onOpenSqlConsole}
                title={isCollapsed ? 'Consola SQL Server (mssql)' : undefined}
                className={`w-full flex items-center rounded-xl text-sm font-medium text-slate-200 hover:bg-[#0c2242] transition-colors group ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Database className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                  {!isCollapsed && <span>Consola SQL Server</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                    mssql
                  </span>
                )}
              </button>

              <button
                onClick={onOpenLdapConfig}
                title={isCollapsed ? 'Active Directory 2012 (LDAP)' : undefined}
                className={`w-full flex items-center rounded-xl text-sm font-medium text-slate-200 hover:bg-[#0c2242] transition-colors group ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                  {!isCollapsed && <span>Active Directory 2012</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                    LDAP
                  </span>
                )}
              </button>

              {onOpenAspNetCoreArchitecture && (
                <button
                  onClick={onOpenAspNetCoreArchitecture}
                  title={isCollapsed ? 'Arquitectura ASP.NET Core (.NET 8)' : undefined}
                  className={`w-full flex items-center rounded-xl text-sm font-medium text-blue-200 hover:text-white bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 transition-colors group ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Server className="w-4 h-4 text-[#00A3E0] group-hover:scale-110 transition-transform shrink-0" />
                    {!isCollapsed && <span>Arquitectura .NET 8</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-700 font-bold">
                      C#
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Companion Trigger */}
        <div className="pt-2 border-t border-[#0f2a52]">
          <button
            onClick={onOpenMobilePreview}
            title={isCollapsed ? 'App Móvil (Companion)' : undefined}
            className={`w-full flex items-center rounded-xl bg-gradient-to-r from-blue-900/40 to-slate-800/40 border border-blue-500/20 hover:border-blue-500/40 text-blue-200 hover:text-white transition-all group ${
              isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
            }`}
          >
            <Smartphone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
            {!isCollapsed && (
              <div className="text-left">
                <p className="text-xs font-semibold leading-tight">App Móvil</p>
                <p className="text-[10px] text-slate-400">Ver vista smartphone</p>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Footer Connection Status */}
      <div className={`border-t border-[#0f2a52] bg-[#051122]/80 transition-all ${isCollapsed ? 'p-3 flex flex-col items-center gap-2' : 'p-4'}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">SQL Server 2012</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    sqlStatusConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-[11px] font-medium text-slate-300">
                  {sqlStatusConnected ? 'Conectado' : 'Modo Seguro'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>LDAP: Windows AD</span>
              <span className="text-emerald-400 font-medium">Activo</span>
            </div>
          </>
        ) : (
          <div
            className="flex flex-col items-center gap-1.5 cursor-pointer"
            title={`SQL Server: ${sqlStatusConnected ? 'Conectado' : 'Modo Seguro'} | LDAP: Activo`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                sqlStatusConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[9px] font-bold text-slate-400">BI</span>
          </div>
        )}
      </div>
    </aside>
  );
};
