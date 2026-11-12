import React, { useState } from 'react';
import {
  Search,
  Bell,
  RefreshCw,
  LogOut,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Download,
  Filter,
  Menu,
} from 'lucide-react';
import { UserProfile, Dashboard } from '../types';

interface HeaderProps {
  title: string;
  currentUser: UserProfile | null;
  dashboardsList?: Dashboard[];
  currentDashboardId?: string;
  onSelectDashboard?: (id: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onLogout: () => void;
  onSwitchUser: (username: string) => void;
  onExport: () => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  currentUser,
  dashboardsList = [],
  currentDashboardId,
  onSelectDashboard,
  onRefresh,
  isRefreshing,
  onLogout,
  onSwitchUser,
  onExport,
  showFilters,
  setShowFilters,
  onToggleSidebar,
  isSidebarCollapsed = false,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dashboardsMenuOpen, setDashboardsMenuOpen] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-0 z-20">
      {/* Title & Quick Search */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && isSidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Expandir barra lateral"
            aria-label="Expandir barra lateral"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
        )}
        <div className="relative">
          {dashboardsList.length > 1 && onSelectDashboard ? (
            <div>
              <button
                onClick={() => setDashboardsMenuOpen(!dashboardsMenuOpen)}
                className="flex items-center gap-2 group text-left focus:outline-none"
                title="Cambiar de Dashboard"
              >
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {title}
                </h1>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors mt-1" />
              </button>
              <p className="text-xs text-slate-500 font-medium">
                SQL Server 2012 • Active Directory corporativo
              </p>

              {dashboardsMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="px-4 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Seleccionar Dashboard
                  </p>
                  {dashboardsList.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDashboard(d.id);
                        setDashboardsMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                        (currentDashboardId || '') === d.id ? 'bg-blue-50/70 font-bold text-blue-700' : 'text-slate-800'
                      }`}
                    >
                      <div>
                        <p className="font-bold leading-tight">{d.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{d.category}</p>
                      </div>
                      {(currentDashboardId || '') === d.id && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
              <p className="text-xs text-slate-500 font-medium">
                SQL Server 2012 • Active Directory corporativo
              </p>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center relative ml-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar métricas, proyectos, clientes..."
            className="pl-10 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-72 transition-all"
          />
        </div>
      </div>

      {/* Actions and User Profile */}
      <div className="flex items-center gap-3.5">
        {/* Toggle Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
            showFilters
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Filtros por Canal, Provincia y Fecha"
        >
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Filtros</span>
        </button>

        {/* Export Data */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          title="Exportar datos a CSV / Excel"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Exportar</span>
        </button>

        {/* Refresh Data */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 border border-slate-200 transition-all disabled:opacity-50"
          title="Actualizar consultas SQL"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* Profile Dropdown as in the photo ("Admin v" with avatar) */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100/80 transition-all border border-slate-200/60"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.displayName || 'Usuario'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.role || 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[110px]">
                {currentUser?.displayName || 'Roberto Salazar'}
              </p>
            </div>
          </button>

          {/* User Menu Modal / Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser?.displayName}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentUser?.role === 'Admin'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    Rol AD: {currentUser?.role}
                  </span>
                  <span className="text-[10px] text-slate-400">{currentUser?.department}</span>
                </div>
              </div>

              {/* Fast Role Switch for testing */}
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Probar Roles de Active Directory
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      onSwitchUser('admin');
                      setUserMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-1.5 ${
                      currentUser?.role === 'Admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <UserCheck className="w-3 h-3" />
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser('juan.perez');
                      setUserMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-1.5 ${
                      currentUser?.role === 'Usuario'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    Usuario
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión LDAP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
