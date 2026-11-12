import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface ChartBarProps {
  title?: string;
  subtitle?: string;
  data: Array<{
    canal: string;
    facturacion: number;
    provincia?: string;
    compradores?: number;
  }>;
}

const BAR_COLORS = ['#1877F2', '#0284C7', '#0EA5E9', '#38BDF8', '#60A5FA'];

export const ChartBar: React.FC<ChartBarProps> = ({
  title = 'Comparativa de Facturación por Canal',
  subtitle = 'Consolidado comercial directo desde SQL Server',
  data,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          Valores en USD ($)
        </span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="canal"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[#07162C] text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/60 text-xs">
                      <p className="font-bold text-slate-300 mb-1">{item.canal}</p>
                      {item.provincia && (
                        <p className="text-slate-400 text-[11px] mb-1">Provincia: {item.provincia}</p>
                      )}
                      <p className="text-emerald-400 font-bold text-sm">
                        ${new Intl.NumberFormat('es-EC').format(item.facturacion)} USD
                      </p>
                      {item.compradores && (
                        <p className="text-slate-300 text-[11px] mt-1">
                          Compradores: {item.compradores}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="facturacion"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
