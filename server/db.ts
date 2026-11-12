/**
 * DroDev BI & Reporting Studio - SQL Server Database Manager
 * Supports Microsoft SQL Server (mssql) with connection pooling,
 * parameterized queries to prevent SQL injection, health checks,
 * and seamless fallback simulation when offline or testing.
 */

import sql from 'mssql';

export interface SqlServerConfig {
  server: string;
  port: number;
  database: string;
  user: string;
  password?: string;
  domain?: string;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    connectTimeout: number;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

// Default corporate connection settings (can be overridden via ENV or Admin UI)
export const currentDbConfig: SqlServerConfig = {
  server: process.env.SQL_SERVER_HOST || '192.168.1.100', // Typical Windows Server 2012 IP
  port: parseInt(process.env.SQL_SERVER_PORT || '1433', 10),
  database: process.env.SQL_SERVER_DATABASE || 'CBSA_CorporateBI',
  user: process.env.SQL_SERVER_USER || 'sa_bi_reporting',
  password: process.env.SQL_SERVER_PASSWORD || 'CorporatePass2026!',
  options: {
    encrypt: false, // Windows Server 2012 LAN setups often use self-signed or unencrypted connections
    trustServerCertificate: true,
    connectTimeout: 5000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;
let isConnectedToLiveSqlServer = false;
let lastConnectionError: string | null = null;
let hasAttemptedInitialConnect = false;

/**
 * Initializes and returns the active SQL Server connection pool.
 */
export async function getSqlPool(): Promise<sql.ConnectionPool | null> {
  // Only attempt initial connection once unless reconfigured
  if (hasAttemptedInitialConnect && !isConnectedToLiveSqlServer) {
    return null;
  }

  if (!poolPromise) {
    hasAttemptedInitialConnect = true;
    try {
      const pool = new sql.ConnectionPool({
        ...currentDbConfig,
        options: {
          ...currentDbConfig.options,
          connectTimeout: 1000, // Fast failover to corporate mock engine
        },
      } as any);

      poolPromise = pool.connect().then((p) => {
        isConnectedToLiveSqlServer = true;
        lastConnectionError = null;
        console.log(`[SQL Server] Conexión establecida a ${currentDbConfig.server}`);
        return p;
      }).catch((err) => {
        isConnectedToLiveSqlServer = false;
        lastConnectionError = err.message;
        poolPromise = null;
        return null as any;
      });
    } catch (err: any) {
      isConnectedToLiveSqlServer = false;
      lastConnectionError = err.message;
      poolPromise = null;
      return null;
    }
  }

  return poolPromise;
}

/**
 * Test connectivity with user-provided SQL Server credentials
 */
export async function testSqlConnection(configOverride?: Partial<SqlServerConfig>): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  const configToTest = {
    ...currentDbConfig,
    ...configOverride,
    options: {
      ...currentDbConfig.options,
      ...(configOverride?.options || {}),
      connectTimeout: 3000,
    },
  };

  try {
    const testPool = new sql.ConnectionPool(configToTest as any);
    await testPool.connect();
    const result = await testPool.request().query('SELECT @@VERSION AS sql_version, GETDATE() AS server_time');
    await testPool.close();
    isConnectedToLiveSqlServer = true;

    return {
      success: true,
      message: 'Conexión a SQL Server exitosa. Instancia verificada.',
      details: result.recordset[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error conectando a SQL Server: ${error.message || 'Verifique host o firewall'}`,
      details: {
        code: error.code,
        originalError: error.message,
        suggestion: 'Asegúrese de habilitar TCP/IP en SQL Server Configuration Manager y abrir el puerto 1433 en Windows Firewall.',
      },
    };
  }
}

/**
 * Execute a parameterized query safely against SQL Server, or fallback to corporate mock data
 */
export async function executeSqlQuery(
  queryText: string,
  parameters: Record<string, any> = {}
): Promise<{
  recordset: any[];
  rowsAffected: number;
  source: 'live_sql_server' | 'corporate_mock_engine';
  executionTimeMs: number;
}> {
  const startTime = Date.now();

  if (isConnectedToLiveSqlServer) {
    try {
      const pool = await getSqlPool();
      if (pool) {
        const request = pool.request();
        for (const [key, value] of Object.entries(parameters)) {
          request.input(key, value);
        }
        const result = await request.query(queryText);
        return {
          recordset: result.recordset,
          rowsAffected: result.rowsAffected.reduce((a, b) => a + b, 0),
          source: 'live_sql_server',
          executionTimeMs: Date.now() - startTime,
        };
      }
    } catch (err: any) {
      console.warn(`[SQL Execution Fallback]: ${err.message}`);
    }
  }

  // Instant fallback to high-fidelity corporate data
  return {
    recordset: getMockQueryResult(queryText, parameters),
    rowsAffected: 12,
    source: 'corporate_mock_engine',
    executionTimeMs: Math.max(5, Date.now() - startTime),
  };
}

/**
 * Realistic corporate data for standard dashboards (Projects, Sales, Executive)
 */
function getMockQueryResult(queryText: string, params: Record<string, any>): any[] {
  const lower = queryText.toLowerCase();

  if (lower.includes('proyectos') || lower.includes('evolucion')) {
    return [
      { mes: 'Ene', proyectos: 18, meta: 20, facturado: 14500 },
      { mes: 'Feb', proyectos: 38, meta: 35, facturado: 22300 },
      { mes: 'Mar', proyectos: 28, meta: 30, facturado: 19800 },
      { mes: 'Abr', proyectos: 46, meta: 40, facturado: 31200 },
      { mes: 'May', proyectos: 36, meta: 45, facturado: 27500 },
      { mes: 'Jun', proyectos: 55, meta: 50, facturado: 39000 },
      { mes: 'Jul', proyectos: 48, meta: 52, facturado: 34500 },
      { mes: 'Ago', proyectos: 68, meta: 60, facturado: 46200 },
      { mes: 'Sep', proyectos: 60, meta: 65, facturado: 41800 },
      { mes: 'Oct', proyectos: 82, meta: 70, facturado: 54000 },
    ];
  }

  if (lower.includes('empaquenthls') || lower.includes('empaque')) {
    return [
      { empaque: 'Latas', hectolitros: 13806.70, nto: 1454357.87, nto_por_hls: 155.19, porcentaje_nto: '76.3%', porcentaje_hls: '76.4%' },
      { empaque: 'Toneles', hectolitros: 3854.50, nto: 284327.18, nto_por_hls: 502.96, porcentaje_nto: '14.9%', porcentaje_hls: '21.3%' },
      { empaque: 'Botellas', hectolitros: 416.81, nto: 162700.22, nto_por_hls: 579.46, porcentaje_nto: '8.5%', porcentaje_hls: '2.3%' },
      { empaque: 'Mat. Promocional', hectolitros: 0.00, nto: 5323.89, nto_por_hls: 0.00, porcentaje_nto: '0.3%', porcentaje_hls: '0.0%' },
    ];
  }

  if (lower.includes('clasifica') || lower.includes('marca')) {
    return [
      { clasifica: 'Cerveza', hectolitros: 10836.49, nto: 1875813.57, nto_por_hls: 173.10 },
      { clasifica: 'Malta', hectolitros: 178.92, nto: 25571.70, nto_por_hls: 142.92 },
    ];
  }

  if (lower.includes('ordenes') || lower.includes('ordenesporanio')) {
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

  if (lower.includes('ventas') || lower.includes('provincia') || lower.includes('canal')) {
    return [
      { canal: 'Directo', provincia: 'Pichincha', facturacion: 85400, compradores: 640, margen: 34.5 },
      { canal: 'Distribuidores', provincia: 'Guayas', facturacion: 62100, compradores: 480, margen: 28.2 },
      { canal: 'E-Commerce', provincia: 'Pichincha', facturacion: 48900, compradores: 390, margen: 42.1 },
      { canal: 'Retail', provincia: 'Azuay', facturacion: 32500, compradores: 280, margen: 25.0 },
      { canal: 'Directo', provincia: 'Manabí', facturacion: 19600, compradores: 160, margen: 31.8 },
    ];
  }

  if (lower.includes('kpi') || lower.includes('totales')) {
    return [
      {
        totalProyectos: 12,
        clientesActivos: 8,
        ingresosTotales: 24780,
        ingresoCobrado: 165000,
        ntoFacturado: 248500,
        compradores: 1690,
      },
    ];
  }

  // Generic fallback recordset
  return [
    { id: 1, item: 'Licencias CBSA Enterprise', valor: 45000, estado: 'Completado' },
    { id: 2, item: 'Consultoría SQL Server 2012', valor: 28000, estado: 'En Progreso' },
    { id: 3, item: 'Migración Active Directory', valor: 19500, estado: 'Planificado' },
  ];
}

export function getDbStatus() {
  return {
    connected: isConnectedToLiveSqlServer,
    server: currentDbConfig.server,
    database: currentDbConfig.database,
    port: currentDbConfig.port,
    user: currentDbConfig.user,
    lastError: lastConnectionError,
  };
}
