import React from 'react';
import {
  FolderPlus,
  UserCheck,
  ServerCog,
  FileCheck2,
  Clock,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  icon: 'folder' | 'user' | 'system' | 'invoice';
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Nuevo proyecto creado',
    timestamp: 'Hace 2 horas',
    icon: 'folder',
  },
  {
    id: '2',
    title: 'Cliente aprobado',
    timestamp: 'Hace 4 horas',
    icon: 'user',
  },
  {
    id: '3',
    title: 'Actualización de sistema',
    timestamp: 'Hace 6 horas',
    icon: 'system',
  },
  {
    id: '4',
    title: 'Sincronización SQL Server completada',
    timestamp: 'Hace 8 horas',
    icon: 'invoice',
  },
];

export const RecentActivityCard: React.FC = () => {
  const getIcon = (type: ActivityItem['icon']) => {
    switch (type) {
      case 'folder':
        return <FolderPlus className="w-4 h-4 text-white" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-white" />;
      case 'system':
        return <ServerCog className="w-4 h-4 text-white" />;
      case 'invoice':
        return <FileCheck2 className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[280px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Actividad Reciente</h3>
          <p className="text-xs text-slate-400">Eventos del ERP y base de datos</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-3.5 overflow-y-auto pr-1">
        {ACTIVITIES.map((item) => (
          <div key={item.id} className="flex items-center gap-3 group">
            {/* Blue circular badge matching reference image */}
            <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {getIcon(item.icon)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-snug">
                {item.title}
              </p>
              <p className="text-[11px] text-slate-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Auditoría LDAP: Activa</span>
        <button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
          Ver historial completo
        </button>
      </div>
    </div>
  );
};
