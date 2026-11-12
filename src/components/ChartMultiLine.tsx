import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface MultiLineItem {
  mes: string;
  [year: string]: number | string;
}

interface ChartMultiLineProps {
  title?: string;
  subtitle?: string;
  data: MultiLineItem[];
  lines?: Array<{
    key: string;
    label: string;
    color: string;
  }>;
}

const DEFAULT_ANNUAL_LINES = [
  { key: 'y2022', label: '2022', color: '#10B981' },
  { key: 'y2023', label: '2023', color: '#0EA5E9' },
  { key: 'y2024', label: '2024', color: '#1E40AF' },
  { key: 'y2025', label: '2025', color: '#8B5CF6' },
  { key: 'y2026', label: '2026', color: '#06B6D4' },
];

export const ChartMultiLine: React.FC<ChartMultiLineProps> = ({
  title = 'Cantidad de Órdenes por Años',
  subtitle = 'Evolución mensual comparativa multianual (2022 - 2026)',
  data,
  lines = DEFAULT_ANNUAL_LINES,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[380px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        {/* Years Legend Pill with dots */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
          {lines.map((l) => (
            <div key={l.key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="font-semibold text-slate-700">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              domain={[0, 100000]}
              ticks={[0, 20000, 40000, 60000, 80000, 100000]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#07162C] text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs min-w-[180px]">
                      <p className="font-bold text-slate-300 pb-1.5 mb-2 border-b border-slate-800">
                        Mes: {label}
                      </p>
                      <div className="space-y-1">
                        {payload.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-slate-300 font-medium">{entry.name}:</span>
                            </div>
                            <span className="font-bold text-white">
                              {new Intl.NumberFormat('es-EC').format(Number(entry.value))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {lines.map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.label}
                stroke={l.color}
                strokeWidth={l.key === 'y2026' ? 3 : 1.75}
                dot={{ r: l.key === 'y2026' ? 3.5 : 2, fill: l.color }}
                activeDot={{ r: 6, fill: l.color, stroke: '#ffffff', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
