import React, { useState } from 'react';
import {
  X,
  Play,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
} from 'lucide-react';
import { api } from '../services/api';
import { SqlQueryResult } from '../types';
import { validateSqlQuery } from '../utils/dataTransformers';

interface SqlConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const SqlConsoleModal: React.FC<SqlConsoleModalProps> = ({
  isOpen,
  onClose,
  initialQuery = 'SELECT Mes, Proyectos, Meta, Facturado FROM Vista_EvolucionProyectos ORDER BY OrdenMes',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SqlQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setError(null);
    const validation = validateSqlQuery(query);
    if (!validation.isValid) {
      setError(validation.error || 'Consulta SQL no válida');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.executeQuery(query);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error ejecutando consulta en SQL Server');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    {
      label: 'Evolución Proyectos',
      sql: 'SELECT Mes, Proyectos, Meta, Facturado FROM Vista_EvolucionProyectos ORDER BY OrdenMes',
    },
    {
      label: 'Ventas por Canal & Provincia',
      sql: 'SELECT Canal, Provincia, Facturacion, Compradores, Margen FROM Resumen_Comercial',
    },
    {
      label: 'KPIs Corporativos',
      sql: 'SELECT TotalProyectos, ClientesActivos, IngresoCobrado, NtoFacturado, Compradores FROM Vista_TotalesBI',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Consola SQL Server 2012 (mssql)</h2>
              <p className="text-xs text-slate-500">
                Ejecución de consultas analíticas parametrizadas de solo lectura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Queries Bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Plantillas SQL:
          </span>
          {sampleQueries.map((s, i) => (
            <button
              key={i}
              onClick={() => setQuery(s.sql)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shrink-0"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Editor & Results Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Sentencia T-SQL</label>
              <span className="text-[11px] text-slate-400">
                Guardas activas: Solo SELECT y WITH CTE admitidos
              </span>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full font-mono text-xs p-3.5 bg-slate-900 text-emerald-300 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 selection:bg-blue-600"
              placeholder="SELECT * FROM ..."
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isLoading ? 'Ejecutando en SQL Server...' : 'Ejecutar Consulta'}</span>
            </button>

            {result && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {result.executionTimeMs} ms
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {result.rowCount} filas
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-semibold border border-slate-200">
                  {result.source === 'live_sql_server' ? 'Instancia Física SQL' : 'Motor Simulado'}
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Query Output Table */}
          {result && result.data && result.data.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-700">
                Resultado de Datos (Recordset)
              </div>
              <div className="max-h-56 overflow-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 sticky top-0">
                    <tr>
                      {Object.keys(result.data[0]).map((col) => (
                        <th key={col} className="px-3 py-2 font-bold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {result.data.map((r, i) => (
                      <tr key={i} className="hover:bg-blue-50/50">
                        {Object.keys(result.data[0]).map((col) => (
                          <td key={col} className="px-3 py-1.5 whitespace-nowrap text-slate-800">
                            {String(r[col] ?? 'NULL')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
