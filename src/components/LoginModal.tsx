import React, { useState } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  Building,
  KeyRound,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (u: string, p: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await api.login(u, p);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Error de autenticación contra Windows Server 2012');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07162C]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 text-center bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            <img
              src="/assets/aistudio/isotipo_cbsa_smooth.png"
              alt="Isotipo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Portal de Business Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Autenticación corporativa Active Directory (Windows Server 2012)
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="px-6 py-3 bg-blue-50/60 border-b border-blue-100/70">
          <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-2">
            Acceso Rápido para Pruebas:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
                handleLogin('admin', 'admin123');
              }}
              className="px-3 py-2 rounded-xl bg-white text-left border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-slate-900">Admin</span>
              </div>
              <p className="text-[10px] text-slate-500">Ing. Roberto Salazar</p>
            </button>

            <button
              onClick={() => {
                setUsername('juan.perez');
                setPassword('user123');
                handleLogin('juan.perez', 'user123');
              }}
              className="px-3 py-2 rounded-xl bg-white text-left border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-slate-900">Usuario</span>
              </div>
              <p className="text-[10px] text-slate-500">Lic. Juan Pérez</p>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(username, password);
          }}
          className="p-8 space-y-4"
        >
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Usuario de Dominio (sAMAccountName)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej: admin o juan.perez"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Contraseña de Dominio
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all"
            >
              <span>{isLoading ? 'Validando contra LDAP...' : 'Iniciar Sesión Corporativa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400">
              Protocolo LDAPv3 • Filtro: (&(objectClass=user)(sAMAccountName=&#123;username&#125;))
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
