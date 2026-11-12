import React from 'react';
import { Calendar, Filter, MapPin, Share2, RotateCcw } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const canales = ['Todos', 'Directo', 'Distribuidores', 'E-Commerce', 'Retail'];
  const provincias = ['Todas', 'Pichincha', 'Guayas', 'Azuay', 'Manabí'];
  const periodos = ['Mes Actual (Nov 2026)', 'Último Trimestre', 'Año 2026 Completo', 'Personalizado'];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-6 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex flex-wrap items-center gap-3">
        {/* Canal Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
          <Share2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-slate-500">Canal:</span>
          <select
            value={filters.canal}
            onChange={(e) => onFilterChange({ ...filters, canal: e.target.value })}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            {canales.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Provincia Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-600" />
          <span className="text-xs font-semibold text-slate-500">Provincia:</span>
          <select
            value={filters.provincia}
            onChange={(e) => onFilterChange({ ...filters, provincia: e.target.value })}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            {provincias.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Periodo / Fecha Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-500">Período:</span>
          <select
            value={filters.periodo}
            onChange={(e) => onFilterChange({ ...filters, periodo: e.target.value })}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            {periodos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset & Status */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-400 font-medium">
          Filtrado en caliente sobre el recordset de SQL Server
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          title="Restablecer filtros predeterminados"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer</span>
        </button>
      </div>
    </div>
  );
};
