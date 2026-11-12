import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FilterBar } from './FilterBar';
import { TabsNav } from './TabsNav';
import { KpiCard } from './KpiCard';
import { ChartLine } from './ChartLine';
import { ChartBar } from './ChartBar';
import { ChartHorizontalBar } from './ChartHorizontalBar';
import { ChartDonut } from './ChartDonut';
import { ChartMultiLine } from './ChartMultiLine';
import { ChartMetas } from './ChartMetas';
import { TechStackCard } from './TechStackCard';
import { RecentActivityCard } from './RecentActivityCard';
import { DataTable } from './DataTable';
import { MobileCompanionModal } from './MobileCompanionModal';
import { SqlConsoleModal } from './SqlConsoleModal';
import { LdapConfigModal } from './LdapConfigModal';
import { AdminDashboardEditor } from './AdminDashboardEditor';
import { LoginModal } from './LoginModal';
import { AspNetCoreArchitectureModal } from './AspNetCoreArchitectureModal';
import {
  Dashboard,
  UserProfile,
  FilterState,
  DashboardTab,
} from '../types';
import { filterDataset } from '../utils/dataTransformers';

interface DashboardLayoutProps {
  dashboard: Dashboard;
  dashboardsList: Dashboard[];
  onSelectDashboard: (id: string) => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onSwitchUser: (username: string) => void;
  chartRows: any[];
  tableRows: any[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onCreateDashboard: (payload: any) => Promise<void>;
  sqlStatusConnected: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  dashboard,
  dashboardsList,
  onSelectDashboard,
  currentUser,
  onLoginSuccess,
  onLogout,
  onSwitchUser,
  chartRows,
  tableRows,
  isRefreshing,
  onRefresh,
  onCreateDashboard,
  sqlStatusConnected,
}) => {
  const [activeNavView, setActiveNavView] = useState('inicio');
  const [activeTabId, setActiveTabId] = useState<string>(
    dashboard?.tabs?.[0]?.id || 'tab-empaque-hls'
  );

  // Sync tab when dashboard changes
  useEffect(() => {
    if (dashboard?.tabs?.length) {
      setActiveTabId(dashboard.tabs[0].id);
    }
  }, [dashboard?.id]);

  // Sidebar collapse state (enables maximizing dashboard canvas)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cbsa_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cbsa_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Filters state (Canal, Provincia, Período)
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    canal: 'Todos',
    provincia: 'Todas',
    periodo: 'Mes Actual (Nov 2026)',
  });

  // Modals state
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [isSqlConsoleOpen, setIsSqlConsoleOpen] = useState(false);
  const [isLdapConfigOpen, setIsLdapConfigOpen] = useState(false);
  const [isNewDashboardOpen, setIsNewDashboardOpen] = useState(false);
  const [isAspNetCoreOpen, setIsAspNetCoreOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Admin';
  const currentTab: DashboardTab =
    dashboard?.tabs?.find((t) => t.id === activeTabId) || dashboard?.tabs?.[0];

  // Tab-specific datasets tailored for the corporate views
  const getTabChartRows = () => {
    if (activeTabId === 'tab-empaque-hls') {
      return [
        { name: 'Latas', value: 1454357.87, displayValue: '$ 1,454,357.87', color: '#84CC16' },
        { name: 'Toneles', value: 284327.18, displayValue: '$ 284,327.18', color: '#0EA5E9' },
        { name: 'Botellas', value: 162700.22, displayValue: '$ 162,700.22', color: '#F43F5E' },
        { name: 'Mat. Promocional', value: 5323.89, displayValue: '$ 5,323.89', color: '#F59E0B' },
      ];
    }
    if (activeTabId === 'tab-ordenes-anios') {
      return [
        { mes: 'Ene', y2022: 3687, y2023: 6863, y2024: 10624, y2025: 15369, y2026: 46947 },
        { mes: 'Feb', y2022: 5084, y2023: 7857, y2024: 12400, y2025: 35438, y2026: 47899 },
        { mes: 'Mar', y2022: 4936, y2023: 7980, y2024: 9609, y2025: 28709, y2026: 83118 },
        { mes: 'Abr', y2022: 5352, y2023: 7262, y2024: 10518, y2025: 18994, y2026: 83911 },
        { mes: 'May', y2022: 6100, y2023: 9935, y2024: 10200, y2025: 16888, y2026: 84046 },
        { mes: 'Jun', y2022: 7800, y2023: 9953, y2024: 14066, y2025: 20686, y2026: 72361 },
        { mes: 'Jul', y2022: 8900, y2023: 11789, y2024: 15396, y2025: 21912, y2026: 75717 },
        { mes: 'Ago', y2022: 9277, y2023: 13500, y2024: 14961, y2025: 23551, y2026: 72120 },
        { mes: 'Sep', y2022: 4625, y2023: 9800, y2024: 13729, y2025: 35776, y2026: 42940 },
        { mes: 'Oct', y2022: 3575, y2023: 6752, y2024: 10980, y2025: 19214, y2026: 70674 },
        { mes: 'Nov', y2022: 8593, y2023: 11655, y2024: 13776, y2025: 22100, y2026: 84090 },
        { mes: 'Dic', y2022: 8831, y2023: 12684, y2024: 14500, y2025: 19942, y2026: 54702 },
      ];
    }
    if (activeTabId === 'tab-ventas') {
      return [
        { canal: 'Directo', facturacion: 85400, provincia: 'Pichincha', compradores: 640 },
        { canal: 'Distribuidores', facturacion: 62100, provincia: 'Guayas', compradores: 480 },
        { canal: 'E-Commerce', facturacion: 48900, provincia: 'Pichincha', compradores: 390 },
        { canal: 'Retail', facturacion: 32500, provincia: 'Azuay', compradores: 280 },
        { canal: 'Mayorista', facturacion: 19600, provincia: 'Manabí', compradores: 160 },
      ];
    }
    if (activeTabId === 'tab-logistica') {
      return [
        { canal: 'Ruta Pichincha - Guayas', facturacion: 42000 },
        { canal: 'Ruta Azuay - El Oro', facturacion: 28500 },
        { canal: 'Ruta Manabí - Los Ríos', facturacion: 19200 },
        { canal: 'Ruta Tungurahua - Chimborazo', facturacion: 14800 },
      ];
    }
    return chartRows.length > 0 ? chartRows : [];
  };

  const getTabTableRows = () => {
    if (activeTabId === 'tab-empaque-hls') {
      return [
        { Empaque: 'Latas', Hectolitros: '13,806.70 Hls', Nto: '$ 1,454,357.87', Nto_Por_Hls: '$ 155.19', Part_Nto: '76.3%', Part_Hls: '76.4%', Estado: 'Completado' },
        { Empaque: 'Toneles', Hectolitros: '3,854.50 Hls', Nto: '$ 284,327.18', Nto_Por_Hls: '$ 502.96', Part_Nto: '14.9%', Part_Hls: '21.3%', Estado: 'Completado' },
        { Empaque: 'Botellas', Hectolitros: '416.81 Hls', Nto: '$ 162,700.22', Nto_Por_Hls: '$ 579.46', Part_Nto: '8.5%', Part_Hls: '2.3%', Estado: 'Completado' },
        { Empaque: 'Mat. Promocional', Hectolitros: '0.00 Hls', Nto: '$ 5,323.89', Nto_Por_Hls: '$ 0.00', Part_Nto: '0.3%', Part_Hls: '0.0%', Estado: 'Auditado' },
      ];
    }
    if (activeTabId === 'tab-marcas-clasifica') {
      return [
        { Clasifica: 'Cerveza (Cristal / Mayabe)', Hectolitros: '10,836.49 Hls', Nto: '$ 1,875,813.57', Nto_Por_Hls: '$ 173.10', Margen: '38.2%', Estado: 'Líder en Ventas' },
        { Clasifica: 'Malta Bucanero', Hectolitros: '178.92 Hls', Nto: '$ 25,571.70', Nto_Por_Hls: '$ 142.92', Margen: '29.4%', Estado: 'En Crecimiento' },
      ];
    }
    if (activeTabId === 'tab-ordenes-anios') {
      return [
        { Mes: 'Ene', y2022: '3,687', y2023: '6,863', y2024: '10,624', y2025: '15,369', y2026: '46,947', Crecimiento: '+205%' },
        { Mes: 'Feb', y2022: '5,084', y2023: '7,857', y2024: '12,400', y2025: '35,438', y2026: '47,899', Crecimiento: '+35.1%' },
        { Mes: 'Mar', y2022: '4,936', y2023: '7,980', y2024: '9,609', y2025: '28,709', y2026: '83,118', Crecimiento: '+189%' },
        { Mes: 'Abr', y2022: '5,352', y2023: '7,262', y2024: '10,518', y2025: '18,994', y2026: '83,911', Crecimiento: '+341%' },
        { Mes: 'May', y2022: '6,100', y2023: '9,935', y2024: '10,200', y2025: '16,888', y2026: '84,046', Crecimiento: '+397%' },
        { Mes: 'Jun', y2022: '7,800', y2023: '9,953', y2024: '14,066', y2025: '20,686', y2026: '72,361', Crecimiento: '+249%' },
        { Mes: 'Jul', y2022: '8,900', y2023: '11,789', y2024: '15,396', y2025: '21,912', y2026: '75,717', Crecimiento: '+245%' },
        { Mes: 'Ago', y2022: '9,277', y2023: '13,500', y2024: '14,961', y2025: '23,551', y2026: '72,120', Crecimiento: '+206%' },
        { Mes: 'Sep', y2022: '4,625', y2023: '9,800', y2024: '13,729', y2025: '35,776', y2026: '42,940', Crecimiento: '+20.0%' },
        { Mes: 'Oct', y2022: '3,575', y2023: '6,752', y2024: '10,980', y2025: '19,214', y2026: '70,674', Crecimiento: '+267%' },
        { Mes: 'Nov', y2022: '8,593', y2023: '11,655', y2024: '13,776', y2025: '22,100', y2026: '84,090', Crecimiento: '+280%' },
        { Mes: 'Dic', y2022: '8,831', y2023: '12,684', y2024: '14,500', y2025: '19,942', y2026: '54,702', Crecimiento: '+174%' },
      ];
    }
    if (activeTabId === 'tab-metas-2026') {
      return [
        { Categoria: 'Cerveza Botellas', MetaMensual: '3,000 Hls', RealOctubre: '3,228 Hls', Cumplimiento: '107.6%', Pico2026: '3,552 Hls (Abr)', Estado: 'Superó Meta' },
        { Categoria: 'Cerveza Latas', MetaMensual: '40,000 Hls', RealOctubre: '34,000 Hls', Cumplimiento: '85.0%', Pico2026: '50,600 Hls (Jun)', Estado: 'En Rango' },
        { Categoria: 'Producto Malta', MetaMensual: '3,500 Hls', RealOctubre: '441 Hls', Cumplimiento: '12.6%', Pico2026: '3,435 Hls (May)', Estado: 'En Campaña' },
        { Categoria: 'Producto Toneles', MetaMensual: '3,500 Hls', RealOctubre: '2,500 Hls', Cumplimiento: '71.4%', Pico2026: '3,500 Hls (Sep)', Estado: 'En Rango' },
        { Categoria: 'MarketPlace (Nto)', MetaMensual: '$ 60,000', RealOctubre: '$ 6,300', Cumplimiento: '10.5%', Pico2026: '$ 17,700 (Ene)', Estado: 'Canal Nuevo' },
      ];
    }
    if (activeTabId === 'tab-ventas') {
      return [
        { Canal: 'Directo', Provincia: 'Pichincha', Facturacion: 85400, Compradores: 640, Margen: '34.5%', Estado: 'Completado' },
        { Canal: 'Distribuidores', Provincia: 'Guayas', Facturacion: 62100, Compradores: 480, Margen: '28.2%', Estado: 'Completado' },
        { Canal: 'E-Commerce', Provincia: 'Pichincha', Facturacion: 48900, Compradores: 390, Margen: '42.1%', Estado: 'Completado' },
        { Canal: 'Retail', Provincia: 'Azuay', Facturacion: 32500, Compradores: 280, Margen: '25.0%', Estado: 'En Revisión' },
        { Canal: 'Directo', Provincia: 'Manabí', Facturacion: 19600, Compradores: 160, Margen: '31.8%', Estado: 'Completado' },
      ];
    }
    if (activeTabId === 'tab-logistica') {
      return [
        { RutaID: 'RT-101', Origen: 'Quito', Destino: 'Guayaquil', Despachos: 142, SLA: '98.5%', CostoFlete: '$ 18.20', Estado: 'A Tiempo' },
        { RutaID: 'RT-102', Origen: 'Cuenca', Destino: 'Machala', Despachos: 98, SLA: '96.2%', CostoFlete: '$ 16.50', Estado: 'A Tiempo' },
        { RutaID: 'RT-103', Origen: 'Manta', Destino: 'Portoviejo', Despachos: 114, SLA: '97.8%', CostoFlete: '$ 14.80', Estado: 'A Tiempo' },
        { RutaID: 'RT-104', Origen: 'Ambato', Destino: 'Riobamba', Despachos: 84, SLA: '95.1%', CostoFlete: '$ 15.10', Estado: 'Retrasado' },
      ];
    }
    return tableRows.length > 0 ? tableRows : [];
  };

  const activeChartRows = getTabChartRows();
  const rawTableRows = getTabTableRows();

  // Filter dynamic dataset
  const filteredTableRows = filterDataset(rawTableRows, {
    canal: filters.canal,
    provincia: filters.provincia,
  });

  const handleExportData = () => {
    // Generate CSV export of current active view
    const rows = filteredTableRows.length > 0 ? filteredTableRows : tableRows;
    if (!rows || rows.length === 0) return;

    const cols = Object.keys(rows[0]);
    const csv = [
      cols.join(','),
      ...rows.map((r) =>
        cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const uri = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `${dashboard.name}_${currentTab?.name || 'Datos'}.csv`;
    link.click();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F7FC]">
      {/* Sidebar with DroDev Navy Aesthetic & Collapsible Hamburger function */}
      <Sidebar
        activeView={activeNavView}
        setActiveView={setActiveNavView}
        currentUser={currentUser}
        onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
        onOpenSqlConsole={() => setIsSqlConsoleOpen(true)}
        onOpenLdapConfig={() => setIsLdapConfigOpen(true)}
        onOpenNewDashboardModal={() => setIsNewDashboardOpen(true)}
        onOpenAspNetCoreArchitecture={() => setIsAspNetCoreOpen(true)}
        sqlStatusConnected={sqlStatusConnected}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Dashboard Switcher */}
        <Header
          title={dashboard?.name || 'Panel de Control'}
          currentUser={currentUser}
          dashboardsList={dashboardsList}
          currentDashboardId={dashboard?.id}
          onSelectDashboard={onSelectDashboard}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onLogout={onLogout}
          onSwitchUser={onSwitchUser}
          onExport={handleExportData}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Vistas / Pestañas Navigation */}
          {dashboard?.tabs && (
            <TabsNav
              tabs={dashboard.tabs}
              activeTabId={activeTabId}
              onSelectTab={setActiveTabId}
              isAdmin={isAdmin}
              onAddNewTab={() => setIsNewDashboardOpen(true)}
            />
          )}

          {/* Top Filter Bar */}
          {showFilters && (
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onReset={() =>
                setFilters({ canal: 'Todos', provincia: 'Todas', periodo: 'Mes Actual (Nov 2026)' })
              }
            />
          )}

          {/* KPI Cards Row (Matches photo: 3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTab?.kpis?.map((kpi, index) => {
              const iconMapping: any = ['projects', 'clients', 'revenue'][index] || 'default';
              return (
                <KpiCard
                  key={kpi.id || index}
                  title={kpi.title}
                  value={kpi.value}
                  trend={kpi.trend}
                  trendPositive={kpi.trendPositive}
                  subtitle={kpi.subtitle}
                  iconType={iconMapping}
                />
              );
            })}
          </div>

          {/* Charts Row - Tailored to CBSA and General Dashboards */}
          <div className="grid grid-cols-1 gap-6">
            {activeTabId === 'tab-empaque-hls' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartHorizontalBar
                  title="Gráfica Nto x Empaque"
                  subtitle="Facturación neta total en USD"
                  unitLabel="Valores Nto en USD"
                  isCurrency={true}
                  data={[
                    { name: 'Latas', value: 1454357.87, color: '#84CC16' },
                    { name: 'Toneles', value: 284327.18, color: '#0EA5E9' },
                    { name: 'Botellas', value: 162700.22, color: '#F43F5E' },
                    { name: 'Mat. Promocional', value: 5323.89, color: '#F59E0B' },
                  ]}
                />
                <ChartHorizontalBar
                  title="Gráfica Hls x Empaque"
                  subtitle="Volumen producido en Hectolitros"
                  unitLabel="Suma de Hectolitros"
                  isCurrency={false}
                  data={[
                    { name: 'Latas', value: 13806.70, color: '#F59E0B' },
                    { name: 'Toneles', value: 3854.50, color: '#FBBF24' },
                    { name: 'Botellas', value: 416.81, color: '#FDE047' },
                  ]}
                />
              </div>
            ) : activeTabId === 'tab-marcas-clasifica' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartDonut
                  title="Gráfica Nto x Marca"
                  subtitle="Distribución de facturación neta"
                  totalLabel="TOTAL NTO"
                  totalValue="$1,901,385.27"
                  slices={[
                    { name: 'Cristal', value: 1366335, percentage: '71.86%', color: '#8B5CF6' },
                    { name: 'Mayabe', value: 459564, percentage: '24.17%', color: '#84CC16' },
                    { name: 'Otro', value: 75486, percentage: '3.97%', color: '#94A3B8' },
                  ]}
                />
                <ChartDonut
                  title="Gráfica Hls x Marca"
                  subtitle="Distribución de volumen en Hls"
                  totalLabel="TOTAL HLS"
                  totalValue="11,015.41 Hls"
                  slices={[
                    { name: 'Cristal', value: 7401.25, percentage: '67.19%', color: '#8B5CF6' },
                    { name: 'Mayabe', value: 3398.25, percentage: '30.85%', color: '#84CC16' },
                    { name: 'Otro', value: 215.91, percentage: '1.96%', color: '#94A3B8' },
                  ]}
                />
              </div>
            ) : activeTabId === 'tab-ordenes-anios' ? (
              <ChartMultiLine
                title="Cantidad de Órdenes por Años (2022 - 2026)"
                subtitle="Evolución histórica mensual por ejercicio fiscal desde SQL Server"
                data={activeChartRows}
              />
            ) : activeTabId === 'tab-metas-2026' ? (
              <ChartMetas />
            ) : currentTab?.chart?.type === 'bar' ? (
              <ChartBar
                title={currentTab.chart.title}
                subtitle="Datos dinámicos parametrizados desde SQL Server"
                data={activeChartRows}
              />
            ) : (
              <ChartLine
                title={currentTab?.chart?.title || 'Evolución de Proyectos'}
                subtitle="Consolidado mensual directo de la base de datos empresarial"
                data={activeChartRows}
              />
            )}
          </div>

          {/* Bottom Dual Cards (Matches photo: Tecnologías on left, Actividad Reciente on right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TechStackCard />
            <RecentActivityCard />
          </div>

          {/* Detailed Data Drill-down Table */}
          <div className="pt-2">
            <DataTable
              title={currentTab?.tableQuery?.title || 'Registros Detallados SQL Server'}
              rows={filteredTableRows}
              onOpenInSqlConsole={() => setIsSqlConsoleOpen(true)}
            />
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <MobileCompanionModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
        currentUser={currentUser}
        dashboardsList={dashboardsList}
        currentDashboard={dashboard}
        onSelectDashboard={onSelectDashboard}
        onRefresh={onRefresh}
      />

      <SqlConsoleModal
        isOpen={isSqlConsoleOpen}
        onClose={() => setIsSqlConsoleOpen(false)}
        initialQuery={currentTab?.chart?.sqlQuery}
      />

      <LdapConfigModal
        isOpen={isLdapConfigOpen}
        onClose={() => setIsLdapConfigOpen(false)}
      />

      <AdminDashboardEditor
        isOpen={isNewDashboardOpen}
        onClose={() => setIsNewDashboardOpen(false)}
        onSaveDashboard={onCreateDashboard}
      />

      <AspNetCoreArchitectureModal
        isOpen={isAspNetCoreOpen}
        onClose={() => setIsAspNetCoreOpen(false)}
      />

      {/* Login Modal when not authenticated */}
      <LoginModal
        isOpen={!currentUser}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
};
