import React from 'react';
import { Cpu } from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  percentage: number;
  color: string;
  badge: string;
}

const DEFAULT_TECHS: TechItem[] = [
  { name: 'React', category: 'Frontend Vite SPA', percentage: 78, color: 'bg-[#00D8FF]', badge: 'UI/UX' },
  { name: 'Node.js', category: 'Express REST API', percentage: 65, color: 'bg-[#539E43]', badge: 'Backend' },
  { name: 'Flutter', category: 'Mobile Multiplatform', percentage: 48, color: 'bg-[#02569B]', badge: 'Móvil' },
  { name: '.NET', category: 'C# Enterprise Core', percentage: 35, color: 'bg-[#512BD4]', badge: 'Legacy' },
];

export const TechStackCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Tecnologías</h3>
          <p className="text-xs text-slate-400">Stack tecnológico en proyectos activos</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Cpu className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-4">
        {DEFAULT_TECHS.map((tech) => (
          <div key={tech.name} className="flex items-center gap-3">
            {/* Tech Name & Icon Pill */}
            <div className="w-24 shrink-0 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${tech.color}`} />
              <span className="text-xs font-bold text-slate-800">{tech.name}</span>
            </div>

            {/* Progress Bar matching reference */}
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1877F2] transition-all duration-700"
                style={{ width: `${tech.percentage}%` }}
              />
            </div>

            {/* Percentage Badge */}
            <span className="w-10 text-right text-xs font-semibold text-slate-500">
              {tech.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Total stack monitorizado</span>
        <span className="font-semibold text-slate-600">4 Entornos en producción</span>
      </div>
    </div>
  );
};
