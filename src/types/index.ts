/**
 * DroDev BI & Reporting Studio - Common Types
 */

export type UserRole = 'Admin' | 'Usuario';

export interface UserProfile {
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  department: string;
  groups: string[];
  avatarUrl: string;
  token: string;
}

export interface KpiDefinition {
  id: string;
  title: string;
  metricField: string;
  value: string | number;
  trend: string;
  trendPositive: boolean;
  subtitle?: string;
  isCurrency?: boolean;
  sqlQuery?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'donut' | 'horizontal-bar' | 'multiline' | 'metas';
  title: string;
  sqlQuery: string;
  xKey: string;
  yKeys: string[];
  labels: Record<string, string>;
  subtitle?: string;
  secondaryTitle?: string;
}

export interface TableConfig {
  title: string;
  sqlQuery: string;
}

export interface DashboardTab {
  id: string;
  name: string;
  icon?: string;
  description: string;
  kpis: KpiDefinition[];
  chart: ChartConfig;
  tableQuery: TableConfig;
}

export interface Dashboard {
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  tabs: DashboardTab[];
}

export interface FilterState {
  canal: string;
  provincia: string;
  periodo: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface SqlQueryResult {
  success: boolean;
  data: any[];
  rowCount: number;
  source: 'live_sql_server' | 'corporate_mock_engine';
  executionTimeMs: number;
  error?: string;
}
