/**
 * DroDev BI & Reporting Studio - Main Application Root
 * Business Intelligence platform inspired by Metabase with enterprise
 * SQL Server 2012 connectivity and Windows Active Directory LDAP auth.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { api, authStorage } from './services/api';
import { Dashboard, UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [dashboardsList, setDashboardsList] = useState<Dashboard[]>([]);
  const [chartRows, setChartRows] = useState<any[]>([]);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sqlStatusConnected, setSqlStatusConnected] = useState(false);

  // Initialize session and default dashboard
  const initApp = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check existing session or initialize default demo session (Admin)
      let user = authStorage.getUser();
      if (!user) {
        user = await api.login('admin', 'admin123');
      }
      setCurrentUser(user);

      // Fetch dashboards list from API
      const dashListRes = await api.getDashboards();
      const list = dashListRes.dashboards || [];
      setDashboardsList(list);

      // Default to CBSA production dashboard based on image or first available
      const defaultId = list.some((d: any) => d.id === 'dash-cbsa-produccion')
        ? 'dash-cbsa-produccion'
        : (list[0]?.id || 'dash-panel-control');

      const data = await api.getDashboard(defaultId);
      setCurrentDashboard(data.dashboard);
      setChartRows(data.liveData.chartRows || []);
      setTableRows(data.liveData.tableRows || []);
      setSqlStatusConnected(data.liveData.dbSource === 'live_sql_server');

      // Check system status
      const status = await api.getSystemStatus();
      if (status?.sqlServer?.connected) {
        setSqlStatusConnected(true);
      }
    } catch (err: any) {
      console.warn('[App Init Warning]:', err.message);
      // Fallback local session if network fails
      const fallbackUser: UserProfile = {
        username: 'admin',
        displayName: 'Ing. Roberto Salazar',
        email: 'roberto.salazar@empresa.com',
        role: 'Admin',
        department: 'Tecnología & BI',
        groups: ['GG_BI_Admins'],
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        token: 'fallback-demo-token',
      };
      setCurrentUser(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initApp();
  }, [initApp]);

  // Refresh active dashboard data
  const handleRefresh = async () => {
    if (!currentDashboard) return;
    setIsRefreshing(true);
    try {
      const data = await api.getDashboard(currentDashboard.id);
      setCurrentDashboard(data.dashboard);
      setChartRows(data.liveData.chartRows || []);
      setTableRows(data.liveData.tableRows || []);
      setSqlStatusConnected(data.liveData.dbSource === 'live_sql_server');
    } catch (err: any) {
      console.error('[Refresh error]:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Switch active dashboard
  const handleSelectDashboard = async (id: string) => {
    setIsRefreshing(true);
    try {
      const data = await api.getDashboard(id);
      setCurrentDashboard(data.dashboard);
      setChartRows(data.liveData.chartRows || []);
      setTableRows(data.liveData.tableRows || []);
      setSqlStatusConnected(data.liveData.dbSource === 'live_sql_server');
    } catch (err: any) {
      console.error('[Select dashboard error]:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Switch between demo roles (Admin vs Usuario)
  const handleSwitchUser = async (username: string) => {
    setIsRefreshing(true);
    try {
      const password = username === 'admin' ? 'admin123' : 'user123';
      const user = await api.login(username, password);
      setCurrentUser(user);
      await handleRefresh();
    } catch (err: any) {
      console.error('[User Switch error]:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const handleCreateDashboard = async (payload: any) => {
    const res = await api.createDashboard(payload);
    // Refresh dashboards list
    const dashListRes = await api.getDashboards();
    setDashboardsList(dashListRes.dashboards || []);
    setCurrentDashboard(res.dashboard);
    await handleRefresh();
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#07162C] text-white">
        <div className="w-16 h-16 flex items-center justify-center mb-4 filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] animate-pulse">
          <img
            src="/assets/aistudio/isotipo_cbsa_smooth.png"
            alt="Isotipo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="font-bold text-base tracking-tight">BI & Reporting Studio</p>
        <p className="text-xs text-slate-400 mt-1">Conectando con SQL Server y Active Directory...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      dashboard={
        currentDashboard || {
          id: 'dash-cbsa-produccion',
          name: 'Producción & Ventas CBSA',
          category: 'Industrial & Comercial',
          description: 'Dashboard principal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Admin',
          tabs: [],
        }
      }
      dashboardsList={dashboardsList}
      onSelectDashboard={handleSelectDashboard}
      currentUser={currentUser}
      onLoginSuccess={(user) => {
        setCurrentUser(user);
        handleRefresh();
      }}
      onLogout={handleLogout}
      onSwitchUser={handleSwitchUser}
      chartRows={chartRows}
      tableRows={tableRows}
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      onCreateDashboard={handleCreateDashboard}
      sqlStatusConnected={sqlStatusConnected}
    />
  );
}
