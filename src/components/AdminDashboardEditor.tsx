import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  LayoutDashboard,
  Layers,
  Database,
} from 'lucide-react';
import { DashboardTab } from '../types';

interface AdminDashboardEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDashboard: (dashboard: {
    name: string;
    category: string;
    description: string;
    tabs: DashboardTab[];
  }) => Promise<void>;
}

export const AdminDashboardEditor: React.FC<AdminDashboardEditorProps> = ({
  isOpen,
  onClose,
  onSaveDashboard,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Comercial');
  const [description, setDescription] = useState('');
  const [tabName, setTabName] = useState('Resumen Comercial');
  const [chartTitle, setChartTitle] = useState('Ventas por Periodo');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [kpi1Title, setKpi1Title] = useState('Ingreso Facturado');
  const [kpi1Value, setKpi1Value] = useState('$ 145,000');
  const [kpi1Trend, setKpi1Trend] = useState('+14.2%');
  const [kpi2Title, setKpi2Title] = useState('Órdenes Emitidas');
  const [kpi2Value, setKpi2Value] = useState('890');
  const [kpi2Trend, setKpi2Trend] = useState('+8.1%');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del dashboard es requerido.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const newTab: DashboardTab = {
      id: `tab-${Date.now()}`,
      name: tabName,
      description: 'Vista personalizada configurada por el administrador',
      kpis: [
        {
          id: `kpi-1-${Date.now()}`,
          title: kpi1Title,
          metricField: 'kpi1',
          value: kpi1Value,
          trend: kpi1Trend,
          trendPositive: true,
          subtitle: 'Calculado vía SQL Server',
          isCurrency: kpi1Value.includes('$'),
          sqlQuery: 'SELECT SUM(Total) FROM Ventas',
        },
        {
          id: `kpi-2-${Date.now()}`,
          title: kpi2Title,
          metricField: 'kpi2',
          value: kpi2Value,
          trend: kpi2Trend,
          trendPositive: true,
          subtitle: 'Registros consolidados',
          sqlQuery: 'SELECT COUNT(*) FROM Pedidos',
        },
      ],
      chart: {
        type: chartType,
        title: chartTitle,
        sqlQuery: 'SELECT Mes, Proyectos, Meta FROM Vista_EvolucionProyectos',
        xKey: 'mes',
        yKeys: ['proyectos'],
        labels: { proyectos: chartTitle },
      },
      tableQuery: {
        title: `Datos de ${tabName}`,
        sqlQuery: 'SELECT TOP 10 * FROM Facturas',
      },
    };

    try {
      await onSaveDashboard({
        name,
        category,
        description,
        tabs: [newTab],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error guardando el dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Diseñador de Dashboards & Vistas
              </h2>
              <p className="text-xs text-slate-500">
                Configure un nuevo cuadro de mando con pestañas y métricas SQL
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nombre del Dashboard
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Dashboard de Distribución Nacional"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Categoría Corporativa
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Gerencial">Gerencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Logística">Logística</option>
                <option value="Financiero">Financiero</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Descripción del Dashboard
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objetivo del dashboard y audiencia destino"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Tab / View Configuration */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Configurar Vista Inicial (Pestaña)
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Nombre de la Vista
                </label>
                <input
                  type="text"
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Tipo de Gráfico
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="line">Líneas (Evolución de Tendencia)</option>
                  <option value="bar">Barras (Comparativa por Categoría)</option>
                  <option value="area">Área (Acumulado de Volúmenes)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Título del Gráfico
              </label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* KPIs */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Definición de KPIs Iniciales
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Título KPI 1
                </label>
                <input
                  type="text"
                  value={kpi1Title}
                  onChange={(e) => setKpi1Title(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Valor KPI 1
                </label>
                <input
                  type="text"
                  value={kpi1Value}
                  onChange={(e) => setKpi1Value(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Tendencia KPI 1
                </label>
                <input
                  type="text"
                  value={kpi1Trend}
                  onChange={(e) => setKpi1Trend(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Crear Dashboard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
