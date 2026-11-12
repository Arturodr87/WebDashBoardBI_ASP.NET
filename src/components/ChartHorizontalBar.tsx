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

interface HorizontalBarItem {
  name: string;
  value: number;
  displayValue?: string;
  color?: string;
}

interface ChartHorizontalBarProps {
  title?: string;
  subtitle?: string;
  unitLabel?: string;
  data: HorizontalBarItem[];
  isCurrency?: boolean;
}

const DEFAULT_VIVID_COLORS = ['#84CC16', '#38BDF8', '#F43F5E', '#F59E0B', '#A855F7'];

export const ChartHorizontalBar: React.FC<ChartHorizontalBarProps> = ({
  title = 'Gráfica por Empaque',
  subtitle = 'Consolidado de producción',
  unitLabel,
  data,
  isCurrency = false,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        {unitLabel && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
            {unitLabel}
          </span>
        )}
      </div>

      <div className="flex-1 w-full min-h-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 35, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(val) => {
                if (isCurrency) {
                  return val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : `$${Math.round(val / 1000)}k`;
                }
                return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`;
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
              width={100}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as HorizontalBarItem;
                  return (
                    <div className="bg-[#07162C] text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/60 text-xs">
                      <p className="font-bold text-slate-300">{item.name}</p>
                      <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
                        {item.displayValue ||
                          (isCurrency
                            ? `$ ${new Intl.NumberFormat('es-EC').format(item.value)} USD`
                            : `${new Intl.NumberFormat('es-EC').format(item.value)} Hls`)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              barSize={24}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_VIVID_COLORS[index % DEFAULT_VIVID_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
