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

interface ChartLineProps {
  title?: string;
  data: Array<{
    mes: string;
    proyectos: number;
    meta?: number;
    facturado?: number;
  }>;
  subtitle?: string;
}

export const ChartLine: React.FC<ChartLineProps> = ({
  title = 'Evolución de Proyectos',
  data,
  subtitle = 'Histórico consolidado desde SQL Server',
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[340px]">
      {/* Chart Title and Status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
            <span className="text-slate-600 font-medium">Proyectos Activos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="text-slate-400 font-medium">Meta Planificada</span>
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#07162C] text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/60 text-xs">
                      <p className="font-bold text-slate-300 mb-1">Mes: {label}</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1877F2]" />
                        <span className="text-slate-300">Proyectos:</span>
                        <span className="font-bold text-white">{payload[0]?.value}</span>
                      </div>
                      {payload[1] && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          <span className="text-slate-300">Meta:</span>
                          <span className="font-bold text-slate-200">{payload[1]?.value}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Projected Target line (dashed) */}
            <Line
              type="monotone"
              dataKey="meta"
              stroke="#CBD5E1"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            {/* Main Project Line matching the photo */}
            <Line
              type="linear"
              dataKey="proyectos"
              stroke="#1877F2"
              strokeWidth={3}
              dot={{
                r: 4.5,
                fill: '#1877F2',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: '#1877F2',
                stroke: '#ffffff',
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
