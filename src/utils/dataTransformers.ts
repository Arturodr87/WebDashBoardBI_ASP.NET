/**
 * DroDev BI & Reporting Studio - Data Transformers & Calculations
 * Pure utility functions for metric calculation, chart data transformation,
 * dataset filtering and SQL safety inspection.
 */

export interface MetricSummary {
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
  formattedCurrent: string;
}

export interface FilterCriteria {
  canal?: string;
  provincia?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Format numbers as corporate currency (e.g. $ 165,000)
 */
export function formatCurrency(amount: number, currencySymbol: string = '$'): string {
  const formatted = new Intl.NumberFormat('es-EC', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
  return `${currencySymbol} ${formatted}`;
}

/**
 * Format general numbers with thousands separator (e.g. 1,690)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-EC').format(value);
}

/**
 * Format volume in Hectolitros (e.g. 18,078.01 Hls)
 */
export function formatHls(hectolitros: number): string {
  const formatted = new Intl.NumberFormat('es-EC', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(hectolitros);
  return `${formatted} Hls`;
}

/**
 * Calculates percentage trend comparison between two periods
 */
export function calculateKpiSummary(
  current: number,
  previous: number,
  isCurrency: boolean = false
): MetricSummary {
  let percentageChange = 0;
  if (previous !== 0) {
    percentageChange = Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
  } else if (current > 0) {
    percentageChange = 100;
  }

  const trend: 'up' | 'down' | 'neutral' =
    percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'neutral';

  return {
    currentValue: current,
    previousValue: previous,
    percentageChange,
    trend,
    formattedCurrent: isCurrency ? formatCurrency(current) : formatNumber(current),
  };
}

/**
 * Safe SQL validator to prevent destructive operations in BI reporting queries
 */
export function validateSqlQuery(query: string): { isValid: boolean; error?: string } {
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: 'La consulta SQL no puede estar vacía' };
  }

  const trimmed = query.trim().toLowerCase();
  
  // BI reporting queries must be read-only (SELECT or WITH)
  if (!trimmed.startsWith('select') && !trimmed.startsWith('with')) {
    return {
      isValid: false,
      error: 'Por seguridad, el motor de BI solo admite consultas de solo lectura (SELECT o WITH CTE).',
    };
  }

  // Check for destructive DDL/DML keywords
  const forbiddenPatterns = [
    /\bdrop\b/i,
    /\bdelete\b/i,
    /\btruncate\b/i,
    /\bupdate\b/i,
    /\binsert\b/i,
    /\balter\b/i,
    /\bexec\b/i,
    /\bexecute\b/i,
    /\bgrant\b/i,
    /\brevoke\b/i,
    /\bcreate\b/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(query)) {
      return {
        isValid: false,
        error: `La consulta contiene sentencias no permitidas (${pattern.toString()}). Solo se permite SELECT.`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Filters rows based on UI filter selections (Canal, Provincia, Dates)
 */
export function filterDataset<T extends Record<string, any>>(
  rows: T[],
  filters: FilterCriteria
): T[] {
  return rows.filter((row) => {
    if (filters.canal && filters.canal !== 'Todos' && row.canal && row.canal !== filters.canal) {
      return false;
    }
    if (filters.provincia && filters.provincia !== 'Todas' && row.provincia && row.provincia !== filters.provincia) {
      return false;
    }
    if (filters.startDate && row.fecha && new Date(row.fecha) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && row.fecha && new Date(row.fecha) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });
}

/**
 * Aggregates row data by key for chart consumption (e.g. group sales by month or channel)
 */
export function aggregateByKey<T extends Record<string, any>>(
  rows: T[],
  groupKey: keyof T,
  sumField: keyof T
): Array<{ label: string; value: number }> {
  const map = new Map<string, number>();

  for (const row of rows) {
    const rawKey = row[groupKey];
    if (rawKey === undefined || rawKey === null) continue;
    const label = String(rawKey);
    const num = Number(row[sumField]) || 0;
    map.set(label, (map.get(label) || 0) + num);
  }

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}
