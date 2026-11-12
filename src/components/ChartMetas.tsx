import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface MetaSeries {
  id: string;
  name: string;
  unit: string;
  targetValue: number;
  targetLabel: string;
  color: string;
  fillColor: string;
  data: Array<{ mes: string; valor: number; meta: number }>;
}

const METAS_CATEGORIES: MetaSeries[] = [
  {
    id: 'botellas',
    name: 'Cerveza Botellas',
    unit: 'Hls',
    targetValue: 3000,
    targetLabel: 'Meta Botellas (3,000 Hls)',
    color: '#84CC16',
    fillColor: '#ECFCCB',
    data: [
      { mes: 'Ene', valor: 2314.62, meta: 3000 },
      { mes: 'Feb', valor: 787.08, meta: 3000 },
      { mes: 'Mar', valor: 713.75, meta: 3000 },
      { mes: 'Abr', valor: 3552.61, meta: 3000 },
      { mes: 'May', valor: 3519.35, meta: 3000 },
      { mes: 'Jun', valor: 2830.88, meta: 3000 },
      { mes: 'Jul', valor: 503.58, meta: 3000 },
      { mes: 'Ago', valor: 3349.33, meta: 3000 },
      { mes: 'Sep', valor: 2752.68, meta: 3000 },
      { mes: 'Oct', valor: 3228.79, meta: 3000 },
      { mes: 'Nov', valor: 76.19, meta: 3000 },
    ],
  },
  {
    id: 'latas',
    name: 'Cerveza Latas',
    unit: 'k Hls',
    targetValue: 40,
    targetLabel: 'Meta Latas (40k Hls)',
    color: '#F97316',
    fillColor: '#FFEDD5',
    data: [
      { mes: 'Ene', valor: 36.1, meta: 40 },
      { mes: 'Feb', valor: 17.5, meta: 40 },
      { mes: 'Mar', valor: 29.3, meta: 40 },
      { mes: 'Abr', valor: 47.5, meta: 40 },
      { mes: 'May', valor: 45.8, meta: 40 },
      { mes: 'Jun', valor: 50.6, meta: 40 },
      { mes: 'Jul', valor: 44.7, meta: 40 },
      { mes: 'Ago', valor: 39.6, meta: 40 },
      { mes: 'Sep', valor: 31.6, meta: 40 },
      { mes: 'Oct', valor: 34.0, meta: 40 },
      { mes: 'Nov', valor: 9.6, meta: 40 },
    ],
  },
  {
    id: 'malta',
    name: 'Producto Malta',
    unit: 'Hls',
    targetValue: 3500,
    targetLabel: 'Meta Maltas (3,500 Hls)',
    color: '#EAB308',
    fillColor: '#FEF9C3',
    data: [
      { mes: 'Ene', valor: 14.96, meta: 3500 },
      { mes: 'Feb', valor: 0.85, meta: 3500 },
      { mes: 'Mar', valor: 18.2, meta: 3500 },
      { mes: 'Abr', valor: 42.0, meta: 3500 },
      { mes: 'May', valor: 3435.26, meta: 3500 },
      { mes: 'Jun', valor: 136.66, meta: 3500 },
      { mes: 'Jul', valor: 81.03, meta: 3500 },
      { mes: 'Ago', valor: 196.64, meta: 3500 },
      { mes: 'Sep', valor: 11.93, meta: 3500 },
      { mes: 'Oct', valor: 441.34, meta: 3500 },
      { mes: 'Nov', valor: 178.92, meta: 3500 },
    ],
  },
  {
    id: 'toneles',
    name: 'Producto Toneles',
    unit: 'k Hls',
    targetValue: 3.5,
    targetLabel: 'Meta Toneles (3.5k Hls)',
    color: '#06B6D4',
    fillColor: '#CFFAFE',
    data: [
      { mes: 'Ene', valor: 2.6, meta: 3.5 },
      { mes: 'Feb', valor: 2.5, meta: 3.5 },
      { mes: 'Mar', valor: 2.4, meta: 3.5 },
      { mes: 'Abr', valor: 2.8, meta: 3.5 },
      { mes: 'May', valor: 2.8, meta: 3.5 },
      { mes: 'Jun', valor: 3.2, meta: 3.5 },
      { mes: 'Jul', valor: 3.3, meta: 3.5 },
      { mes: 'Ago', valor: 3.4, meta: 3.5 },
      { mes: 'Sep', valor: 3.5, meta: 3.5 },
      { mes: 'Oct', valor: 2.5, meta: 3.5 },
      { mes: 'Nov', valor: 1.1, meta: 3.5 },
    ],
  },
  {
    id: 'marketplace',
    name: 'MarketPlace (Nto)',
    unit: '$k USD',
    targetValue: 60.0,
    targetLabel: 'Meta MarketPlace ($60.0k)',
    color: '#10B981',
    fillColor: '#D1FAE5',
    data: [
      { mes: 'Ene', valor: 17.7, meta: 60.0 },
      { mes: 'Feb', valor: 16.0, meta: 60.0 },
      { mes: 'Mar', valor: 6.4, meta: 60.0 },
      { mes: 'Abr', valor: 10.5, meta: 60.0 },
      { mes: 'May', valor: 6.8, meta: 60.0 },
      { mes: 'Jun', valor: 7.0, meta: 60.0 },
      { mes: 'Jul', valor: 3.8, meta: 60.0 },
      { mes: 'Ago', valor: 12.9, meta: 60.0 },
      { mes: 'Sep', valor: 6.3, meta: 60.0 },
      { mes: 'Oct', valor: 6.3, meta: 60.0 },
      { mes: 'Nov', valor: 1.1, meta: 60.0 },
    ],
  },
];

export const ChartMetas: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState('botellas');
  const current = METAS_CATEGORIES.find((c) => c.id === selectedCatId) || METAS_CATEGORIES[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Metas Mensuales vs Real (2026) — {current.name}
          </h3>
          <p className="text-xs text-slate-400">
            Comparativa contra objetivo planificado fijado en SQL Server
          </p>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          {METAS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedCatId === cat.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat.name.replace('Producto ', '').replace('Cerveza ', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={current.data} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id={`grad-${current.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={current.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={current.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              tickFormatter={(v) => `${v} ${current.unit}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  return (
                    <div className="bg-[#07162C] text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs">
                      <p className="font-bold text-slate-300">Mes: {label} 2026</p>
                      <p className="text-emerald-400 font-bold text-sm mt-0.5">
                        Real: {new Intl.NumberFormat('es-EC').format(Number(val))} {current.unit}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Meta: {new Intl.NumberFormat('es-EC').format(current.targetValue)} {current.unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Target dashed reference line */}
            <ReferenceLine
              y={current.targetValue}
              stroke="#64748B"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: current.targetLabel,
                position: 'top',
                fill: '#64748B',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke={current.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#grad-${current.id})`}
              dot={{ r: 4, fill: current.color, stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: current.color, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
