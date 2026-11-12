import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Server,
  Key,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

interface LdapConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LdapConfigModal: React.FC<LdapConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [ldapUrl, setLdapUrl] = useState('ldap://192.168.1.10:389');
  const [baseDn, setBaseDn] = useState('DC=empresa,DC=local');
  const [bindDn, setBindDn] = useState('CN=svc_bi_ldap,OU=ServiceAccounts,DC=empresa,DC=local');
  const [adminGroup, setAdminGroup] = useState('GG_BI_Admins');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTestLdap = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.testLdapConnection({
        url: ldapUrl,
        baseDN: baseDn,
        bindDN: bindDn,
        adminGroupName: adminGroup,
      });
      setTestResult({ success: true, ...res });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Active Directory / LDAP (Windows Server 2012)
              </h2>
              <p className="text-xs text-slate-500">
                Configuración del controlador de dominio y roles corporativos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              URL del Servidor LDAP (AD DS)
            </label>
            <input
              type="text"
              value={ldapUrl}
              onChange={(e) => setLdapUrl(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ldap://192.168.1.10:389"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Puerto predeterminado: 389 (LDAP simple) o 636 (LDAPS SSL)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Base DN (Raíz de Búsqueda)
              </label>
              <input
                type="text"
                value={baseDn}
                onChange={(e) => setBaseDn(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Grupo Active Directory Admin
              </label>
              <input
                type="text"
                value={adminGroup}
                onChange={(e) => setAdminGroup(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              Cuenta de Servicio Bind DN
            </label>
            <input
              type="text"
              value={bindDn}
              onChange={(e) => setBindDn(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Test Status Feedback */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{testResult.message}</p>
                {testResult.domainController && (
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Controlador: {testResult.domainController} | Nivel de bosque:{' '}
                    {testResult.forestFunctionalLevel}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleTestLdap}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Probando Bind AD...' : 'Probar Conexión LDAP'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};
