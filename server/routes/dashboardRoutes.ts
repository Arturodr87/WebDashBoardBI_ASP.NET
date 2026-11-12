/**
 * DroDev BI & Reporting Studio - Express API Routes
 * Endpoints for Dashboards CRUD, Views/Tabs, KPIs, SQL Execution, and Auth
 */

import { Router, Request, Response } from 'express';
import { executeSqlQuery, testSqlConnection, getDbStatus } from '../db';
import {
  authenticateLdap,
  verifyAuthToken,
  requireAdminRole,
  testLdapConnection,
  currentLdapConfig,
} from '../ldap';
import { validateSqlQuery } from '../../src/utils/dataTransformers';

export const dashboardRouter = Router();

// In-memory persistent dashboard store seeded with the corporate dashboards
interface DashboardTab {
  id: string;
  name: string;
  icon?: string;
  description: string;
  kpis: Array<{
    id: string;
    title: string;
    metricField: string;
    value: string | number;
    trend: string;
    trendPositive: boolean;
    subtitle?: string;
    isCurrency?: boolean;
    sqlQuery?: string;
  }>;
  chart: {
    type: 'line' | 'bar' | 'area';
    title: string;
    sqlQuery: string;
    xKey: string;
    yKeys: string[];
    labels: Record<string, string>;
  };
  tableQuery: {
    title: string;
    sqlQuery: string;
  };
}

interface Dashboard {
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  tabs: DashboardTab[];
}

let dashboards: Dashboard[] = [
  {
    id: 'dash-cbsa-produccion',
    name: 'Producción & Ventas CBSA',
    category: 'Industrial & Comercial',
    description: 'Dashboard integral de Cervecería Bucanero S.A. con Hls producidos, Nto por empaque, marcas Cristal/Mayabe y metas 2026.',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-11-07T11:00:00Z',
    author: 'Ing. Roberto Salazar (Admin)',
    tabs: [
      {
        id: 'tab-empaque-hls',
        name: 'Empaque y Volumen (Hls)',
        icon: 'Package',
        description: 'Desglose de Nto y Hls producidos por tipo de empaque (Latas, Toneles, Botellas).',
        kpis: [
          {
            id: 'kpi-cbsa-1',
            title: 'Nto Absoluto Total',
            metricField: 'ntoTotal',
            value: '$ 1,906,709.16',
            trend: '+18.4% vs meta',
            trendPositive: true,
            subtitle: 'Facturación neta total consolidada',
            isCurrency: true,
            sqlQuery: 'SELECT SUM(Nto) AS ntoTotal FROM Vista_EmpaqueNtoHls',
          },
          {
            id: 'kpi-cbsa-2',
            title: 'Volumen Total Producido',
            metricField: 'hlsTotal',
            value: '18,078.01 Hls',
            trend: '+9.2%',
            trendPositive: true,
            subtitle: 'Hectolitros despachados a nivel nacional',
            sqlQuery: 'SELECT SUM(Hectolitros) AS hlsTotal FROM Vista_EmpaqueNtoHls',
          },
          {
            id: 'kpi-cbsa-3',
            title: 'Rendimiento Promedio',
            metricField: 'ntoPorHls',
            value: '$ 239.12 / Hls',
            trend: '+4.8% eficiencia',
            trendPositive: true,
            subtitle: 'Ingreso promedio por hectolitro',
            isCurrency: true,
            sqlQuery: 'SELECT AVG(Nto_Por_Hls) AS ntoPorHls FROM Vista_EmpaqueNtoHls',
          },
        ],
        chart: {
          type: 'horizontal-bar' as any,
          title: 'Gráfica Nto y Hls por Empaque',
          sqlQuery: 'SELECT Empaque, Hectolitros, Nto, Nto_Por_Hls FROM Vista_EmpaqueNtoHls ORDER BY Nto DESC',
          xKey: 'empaque',
          yKeys: ['nto'],
          labels: { nto: 'Nto ($ USD)' },
        },
        tableQuery: {
          title: 'Empaque Nto / Hls — Consolidado SQL Server',
          sqlQuery: 'SELECT Empaque, Hectolitros, Nto, Nto_Por_Hls FROM Vista_EmpaqueNtoHls',
        },
      },
      {
        id: 'tab-marcas-clasifica',
        name: 'Marcas y Clasificación',
        icon: 'Award',
        description: 'Participación por marca (Cristal, Mayabe) y clasificación (Cerveza vs Malta).',
        kpis: [
          {
            id: 'kpi-mc-1',
            title: 'Cerveza Total Nto',
            metricField: 'cervezaNto',
            value: '$ 1,875,813.57',
            trend: '10,836.49 Hls',
            trendPositive: true,
            subtitle: 'Rendimiento $173.10 / Hls',
            isCurrency: true,
            sqlQuery: 'SELECT SUM(Nto) AS cervezaNto FROM Vista_Clasifica WHERE Clasifica = "Cerveza"',
          },
          {
            id: 'kpi-mc-2',
            title: 'Malta Total Nto',
            metricField: 'maltaNto',
            value: '$ 25,571.70',
            trend: '178.92 Hls',
            trendPositive: true,
            subtitle: 'Rendimiento $142.92 / Hls',
            isCurrency: true,
            sqlQuery: 'SELECT SUM(Nto) AS maltaNto FROM Vista_Clasifica WHERE Clasifica = "Malta"',
          },
          {
            id: 'kpi-mc-3',
            title: 'Cristal (Marca Líder)',
            metricField: 'cristalShare',
            value: '71.86% Nto',
            trend: '67.19% Hls',
            trendPositive: true,
            subtitle: 'Marca más consumida a nivel nacional',
            sqlQuery: 'SELECT ShareNto FROM Vista_Marca WHERE Marca = "Cristal"',
          },
        ],
        chart: {
          type: 'donut' as any,
          title: 'Participación de Marcas (Nto y Hls)',
          sqlQuery: 'SELECT Marca, ShareNto, ShareHls FROM Vista_Marca',
          xKey: 'marca',
          yKeys: ['shareNto'],
          labels: { shareNto: 'Participación Nto' },
        },
        tableQuery: {
          title: 'Clasifica Nto / Hls — Detalle de Categorías',
          sqlQuery: 'SELECT Clasifica, Hectolitros, Nto, Nto_Por_Hls FROM Vista_Clasifica',
        },
      },
      {
        id: 'tab-ordenes-anios',
        name: 'Histórico de Órdenes (2022-2026)',
        icon: 'Calendar',
        description: 'Evolución mensual comparativa multianual de cantidad de órdenes generadas.',
        kpis: [
          {
            id: 'kpi-ord-1',
            title: 'Órdenes Totales 2026',
            metricField: 'ordenes2026',
            value: '548,290',
            trend: '+14.2% vs 2025',
            trendPositive: true,
            subtitle: 'Volumen total procesado',
            sqlQuery: 'SELECT SUM(TotalOrdenes) FROM Vista_OrdenesAnuales WHERE Anio = 2026',
          },
          {
            id: 'kpi-ord-2',
            title: 'Pico Histórico Mensual',
            metricField: 'picoMes',
            value: '84,090 órdenes',
            trend: 'Noviembre 2026',
            trendPositive: true,
            subtitle: 'Máximo histórico registrado en CBSA',
            sqlQuery: 'SELECT MAX(TotalOrdenes) FROM Vista_OrdenesAnuales',
          },
          {
            id: 'kpi-ord-3',
            title: 'Promedio Mensual',
            metricField: 'promedioMensual',
            value: '45,690 órdenes/mes',
            trend: '+8.6% interanual',
            trendPositive: true,
            subtitle: 'Ritmo operativo continuo',
            sqlQuery: 'SELECT AVG(TotalOrdenes) FROM Vista_OrdenesAnuales WHERE Anio = 2026',
          },
        ],
        chart: {
          type: 'multiline' as any,
          title: 'Cantidad de Órdenes por Años (2022 - 2026)',
          sqlQuery: 'SELECT Mes, y2022, y2023, y2024, y2025, y2026 FROM Vista_OrdenesPorAnio ORDER BY OrdenMes',
          xKey: 'mes',
          yKeys: ['y2026', 'y2025', 'y2024', 'y2023', 'y2022'],
          labels: { y2026: '2026', y2025: '2025', y2024: '2024', y2023: '2023', y2022: '2022' },
        },
        tableQuery: {
          title: 'Matriz Comparativa de Órdenes por Año y Mes',
          sqlQuery: 'SELECT Mes, y2022, y2023, y2024, y2025, y2026 FROM Vista_OrdenesPorAnio',
        },
      },
      {
        id: 'tab-metas-2026',
        name: 'Metas por Categoría (2026)',
        icon: 'Target',
        description: 'Cumplimiento mensual contra metas fijadas para Botellas, Latas, Malta, Toneles y Marketplace.',
        kpis: [
          {
            id: 'kpi-m-1',
            title: 'Cerveza Botellas',
            metricField: 'botellasReal',
            value: '3,228 Hls',
            trend: 'Meta 3,000 Hls (107.6%)',
            trendPositive: true,
            subtitle: 'Superó la meta mensual',
            sqlQuery: 'SELECT Hectolitros FROM Vista_Metas WHERE Categoria = "Botellas" AND Mes = 10',
          },
          {
            id: 'kpi-m-2',
            title: 'Cerveza Latas Pico',
            metricField: 'latasPico',
            value: '50.6k Hls',
            trend: 'Junio 2026 (Meta 40k)',
            trendPositive: true,
            subtitle: 'Capacidad de envasado al 98%',
            sqlQuery: 'SELECT MAX(Hectolitros) FROM Vista_Metas WHERE Categoria = "Latas"',
          },
          {
            id: 'kpi-m-3',
            title: 'MarketPlace (Nto)',
            metricField: 'marketplacePico',
            value: '$ 17.7k pico',
            trend: 'Enero 2026 (Meta $60k)',
            trendPositive: true,
            subtitle: 'Canal digital B2B directo',
            isCurrency: true,
            sqlQuery: 'SELECT MAX(Monto) FROM Vista_MetasMarketplace',
          },
        ],
        chart: {
          type: 'metas' as any,
          title: 'Gráfica de Cumplimiento de Metas por Categoría',
          sqlQuery: 'SELECT Mes, Categoria, Valor, Meta FROM Vista_Metas2026',
          xKey: 'mes',
          yKeys: ['valor', 'meta'],
          labels: { valor: 'Real', meta: 'Meta Planificada' },
        },
        tableQuery: {
          title: 'Control Mensual de Metas y Desvíos',
          sqlQuery: 'SELECT Mes, Categoria, RealHls, MetaHls, CumplimientoPct, Estado FROM Vista_ControlMetas',
        },
      },
    ],
  },
  {
    id: 'dash-panel-control',
    name: 'Panel de Control',
    category: 'Gerencial',
    description: 'Dashboard principal de control corporativo de proyectos, clientes y facturación.',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-11-06T12:00:00Z',
    author: 'Ing. Roberto Salazar (Admin)',
    tabs: [
      {
        id: 'tab-resumen',
        name: 'Resumen Ejecutivo',
        icon: 'LayoutDashboard',
        description: 'Métricas de alto impacto sobre proyectos y facturación corporativa.',
        kpis: [
          {
            id: 'kpi-1',
            title: 'Total Proyectos',
            metricField: 'totalProyectos',
            value: 12,
            trend: '+2 este mes',
            trendPositive: true,
            subtitle: 'En desarrollo activo',
            sqlQuery: 'SELECT COUNT(*) AS totalProyectos FROM Proyectos WHERE Estado = "Activo"',
          },
          {
            id: 'kpi-2',
            title: 'Clientes Activos',
            metricField: 'clientesActivos',
            value: 8,
            trend: '+1 este mes',
            trendPositive: true,
            subtitle: 'Con contratos vigentes',
            sqlQuery: 'SELECT COUNT(DISTINCT ClienteID) AS clientesActivos FROM Clientes WHERE SaldoPendiente >= 0',
          },
          {
            id: 'kpi-3',
            title: 'Ingresos',
            metricField: 'ingresosTotales',
            value: '$ 24,780',
            trend: '+15.3%',
            trendPositive: true,
            subtitle: 'Facturación neta del mes',
            isCurrency: true,
            sqlQuery: 'SELECT SUM(MontoNeto) AS ingresosTotales FROM Facturas WHERE MONTH(Fecha) = MONTH(GETDATE())',
          },
        ],
        chart: {
          type: 'line',
          title: 'Evolución de Proyectos',
          sqlQuery: 'SELECT Mes, Proyectos, Meta FROM Vista_EvolucionProyectos ORDER BY OrdenMes',
          xKey: 'mes',
          yKeys: ['proyectos'],
          labels: { proyectos: 'Proyectos Activos' },
        },
        tableQuery: {
          title: 'Detalle de Proyectos y Contratos',
          sqlQuery: 'SELECT TOP 10 ID, Nombre, Cliente, Presupuesto, Estado FROM Proyectos ORDER BY FechaFin DESC',
        },
      },
      {
        id: 'tab-ventas',
        name: 'Ventas y Facturación',
        icon: 'TrendingUp',
        description: 'Desglose comercial: Ingreso Cobrado, NTO Facturado y Compradores.',
        kpis: [
          {
            id: 'kpi-v1',
            title: 'Ingreso Cobrado',
            metricField: 'ingresoCobrado',
            value: '$ 165,000',
            trend: '+18.4% vs meta',
            trendPositive: true,
            subtitle: 'Cobranza efectiva en tesorería',
            isCurrency: true,
            sqlQuery: 'SELECT SUM(TotalCobrado) AS ingresoCobrado FROM Tesoreria_Cobros WHERE Anio = 2026',
          },
          {
            id: 'kpi-v2',
            title: 'NTO Facturado',
            metricField: 'ntoFacturado',
            value: '$ 248,500',
            trend: '+12.1%',
            trendPositive: true,
            subtitle: 'Neto total facturado',
            isCurrency: true,
            sqlQuery: 'SELECT SUM(SubtotalNeto) AS ntoFacturado FROM Facturacion_Encabezado',
          },
          {
            id: 'kpi-v3',
            title: 'Compradores',
            metricField: 'compradores',
            value: '1,690',
            trend: '+142 nuevos',
            trendPositive: true,
            subtitle: 'Clientes con transacciones',
            sqlQuery: 'SELECT COUNT(DISTINCT ClienteID) AS compradores FROM Ventas_Diarias',
          },
        ],
        chart: {
          type: 'bar',
          title: 'Comparativa de Facturación por Canal y Provincia',
          sqlQuery: 'SELECT Canal, Provincia, Facturacion FROM Vista_VentasCanalProvincia',
          xKey: 'canal',
          yKeys: ['facturacion'],
          labels: { facturacion: 'Facturación ($ USD)' },
        },
        tableQuery: {
          title: 'Ventas Desglosadas por Canal y Provincia',
          sqlQuery: 'SELECT Canal, Provincia, Facturacion, Compradores, Margen FROM Resumen_Comercial',
        },
      },
      {
        id: 'tab-logistica',
        name: 'Logística y Operaciones',
        icon: 'Truck',
        description: 'Monitoreo de despachos, tiempos de entrega y nivel de servicio (SLA).',
        kpis: [
          {
            id: 'kpi-l1',
            title: 'Despachos Realizados',
            metricField: 'despachos',
            value: '438',
            trend: '+9.2%',
            trendPositive: true,
            subtitle: 'Guías de remisión cerradas',
            sqlQuery: 'SELECT COUNT(*) AS despachos FROM GuiasRemision WHERE Estado = "Entregado"',
          },
          {
            id: 'kpi-l2',
            title: 'SLA Entrega a Tiempo',
            metricField: 'sla',
            value: '97.4%',
            trend: '+1.5%',
            trendPositive: true,
            subtitle: 'Objetivo operativo >= 95%',
            sqlQuery: 'SELECT AVG(CumplimientoSLA) AS sla FROM Despachos_KPI',
          },
          {
            id: 'kpi-l3',
            title: 'Costo Promedio / Envío',
            metricField: 'costoEnvio',
            value: '$ 18.20',
            trend: '-4.3% ahorro',
            trendPositive: true,
            subtitle: 'Eficiencia de ruta',
            isCurrency: true,
            sqlQuery: 'SELECT AVG(CostoFlete) AS costoEnvio FROM Rutas_Transporte',
          },
        ],
        chart: {
          type: 'area',
          title: 'Cumplimiento Diario de Rutas',
          sqlQuery: 'SELECT Dia, Completadas, Retrasadas FROM Rutas_Mensuales',
          xKey: 'mes',
          yKeys: ['proyectos'],
          labels: { proyectos: 'Entregas a tiempo' },
        },
        tableQuery: {
          title: 'Monitoreo de Rutas y Fletes',
          sqlQuery: 'SELECT RutaID, Provincia, Destino, Conductor, Estado FROM Rutas_Activas',
        },
      },
    ],
  },
];

// -------------------------------------------------------------
// AUTH ENDPOINTS (Active Directory / LDAP)
// -------------------------------------------------------------

dashboardRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña de Active Directory requeridos.' });
    }

    const authResult = await authenticateLdap(username, password);
    if (!authResult.success || !authResult.user) {
      return res.status(401).json({ error: authResult.message });
    }

    return res.json({
      success: true,
      message: authResult.message,
      user: authResult.user,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error en autenticación LDAP' });
  }
});

dashboardRouter.get('/auth/me', verifyAuthToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json({ user });
});

// -------------------------------------------------------------
// DASHBOARDS CRUD
// -------------------------------------------------------------

// List dashboards
dashboardRouter.get('/dashboards', verifyAuthToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json({
    dashboards: dashboards.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      description: d.description,
      author: d.author,
      updatedAt: d.updatedAt,
      tabsCount: d.tabs.length,
    })),
    userRole: user.role,
  });
});

// Get single dashboard with its data
dashboardRouter.get('/dashboards/:id', verifyAuthToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const dashboard = dashboards.find((d) => d.id === id);

  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard no encontrado' });
  }

  // Pre-fetch live SQL data for the active view to hydrate charts
  const liveChartData = await executeSqlQuery(dashboard.tabs[0]?.chart?.sqlQuery || 'SELECT * FROM Proyectos');
  const liveTableData = await executeSqlQuery(dashboard.tabs[0]?.tableQuery?.sqlQuery || 'SELECT * FROM Ventas');

  return res.json({
    dashboard,
    liveData: {
      chartRows: liveChartData.recordset,
      tableRows: liveTableData.recordset,
      dbSource: liveChartData.source,
      executionTimeMs: liveChartData.executionTimeMs,
    },
  });
});

// Admin: Create dashboard
dashboardRouter.post('/dashboards', verifyAuthToken, requireAdminRole, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, category, description, tabs } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre del dashboard es obligatorio.' });
  }

  const newDashboard: Dashboard = {
    id: `dash-${Date.now()}`,
    name,
    category: category || 'General',
    description: description || 'Dashboard creado por el Administrador.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: `${user.displayName} (${user.role})`,
    tabs: tabs && tabs.length > 0 ? tabs : [
      {
        id: `tab-${Date.now()}-1`,
        name: 'Resumen General',
        description: 'Vista inicial predeterminada.',
        kpis: [
          {
            id: 'kpi-gen-1',
            title: 'Indicador 1',
            metricField: 'valor',
            value: '$ 45,000',
            trend: '+5.0%',
            trendPositive: true,
          },
        ],
        chart: {
          type: 'line',
          title: 'Evolución Histórica',
          sqlQuery: 'SELECT Mes, Proyectos FROM Vista_EvolucionProyectos',
          xKey: 'mes',
          yKeys: ['proyectos'],
          labels: { proyectos: 'Proyectos' },
        },
        tableQuery: {
          title: 'Registros Recientes',
          sqlQuery: 'SELECT TOP 10 * FROM Proyectos',
        },
      },
    ],
  };

  dashboards.push(newDashboard);
  return res.status(201).json({ success: true, dashboard: newDashboard });
});

// Admin: Update dashboard (e.g. add new tab, edit kpis)
dashboardRouter.put('/dashboards/:id', verifyAuthToken, requireAdminRole, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = dashboards.findIndex((d) => d.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Dashboard no encontrado' });
  }

  const current = dashboards[index];
  const { name, category, description, tabs } = req.body;

  dashboards[index] = {
    ...current,
    name: name ?? current.name,
    category: category ?? current.category,
    description: description ?? current.description,
    tabs: tabs ?? current.tabs,
    updatedAt: new Date().toISOString(),
  };

  return res.json({ success: true, dashboard: dashboards[index] });
});

// Admin: Delete dashboard
dashboardRouter.delete('/dashboards/:id', verifyAuthToken, requireAdminRole, (req: Request, res: Response) => {
  const { id } = req.params;
  if (dashboards.length <= 1) {
    return res.status(400).json({ error: 'No se puede eliminar el dashboard principal del sistema.' });
  }

  dashboards = dashboards.filter((d) => d.id !== id);
  return res.json({ success: true, message: 'Dashboard eliminado exitosamente.' });
});

// -------------------------------------------------------------
// SQL QUERY RUNNER (Safe parameterized execution)
// -------------------------------------------------------------

dashboardRouter.post('/query/execute', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const { sql: querySql, parameters } = req.body;

    const validation = validateSqlQuery(querySql);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await executeSqlQuery(querySql, parameters || {});
    return res.json({
      success: true,
      data: result.recordset,
      rowCount: result.recordset.length,
      source: result.source,
      executionTimeMs: result.executionTimeMs,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error ejecutando consulta SQL' });
  }
});

// -------------------------------------------------------------
// SYSTEM STATUS & DIAGNOSTICS (SQL Server & LDAP)
// -------------------------------------------------------------

dashboardRouter.get('/system/status', (req: Request, res: Response) => {
  return res.json({
    sqlServer: getDbStatus(),
    ldap: {
      url: currentLdapConfig.url,
      baseDN: currentLdapConfig.baseDN,
      adminGroup: currentLdapConfig.adminGroupName,
    },
  });
});

dashboardRouter.post('/config/sql-test', verifyAuthToken, async (req: Request, res: Response) => {
  const result = await testSqlConnection(req.body);
  return res.json(result);
});

dashboardRouter.post('/config/ldap-test', verifyAuthToken, async (req: Request, res: Response) => {
  const result = await testLdapConnection(req.body);
  return res.json(result);
});
