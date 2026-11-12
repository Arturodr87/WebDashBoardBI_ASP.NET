import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface DonutSlice {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

interface ChartDonutProps {
  title?: string;
  subtitle?: string;
  totalLabel?: string;
  totalValue: string;
  slices: DonutSlice[];
}

export const ChartDonut: React.FC<ChartDonutProps> = ({
  title = 'Participación por Marca',
  subtitle = 'Distribución consolidada',
  totalLabel = 'TOTAL',
  totalValue,
  slices,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between min-h-0 gap-4">
        {/* Left: Legend with % */}
        <div className="w-full sm:w-1/3 space-y-2.5 pl-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-semibold text-slate-700">{slice.name}</span>
              </div>
              <span className="font-bold text-slate-900">{slice.percentage}</span>
            </div>
          ))}
        </div>

        {/* Right: Pie Canvas with Centered Value */}
        <div className="flex-1 w-full h-full relative min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DonutSlice;
                    return (
                      <div className="bg-[#07162C] text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700 text-xs">
                        <p className="font-bold text-slate-300">{data.name}</p>
                        <p className="text-emerald-400 font-extrabold">{data.percentage}</p>
                        <p className="text-[11px] text-slate-400">
                          {typeof data.value === 'number' ? new Intl.NumberFormat('es-EC').format(data.value) : data.value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={slices}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                dataKey="value"
              >
                {slices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              {totalValue}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {totalLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
