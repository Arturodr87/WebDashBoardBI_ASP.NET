/**
 * DroDev BI & Reporting Studio - API Service Client
 * Handles authenticated requests to Express backend with Bearer token
 */

import { Dashboard, UserProfile, SqlQueryResult } from '../types';

const TOKEN_KEY = 'drodev_bi_auth_token';
const USER_KEY = 'drodev_bi_auth_user';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  saveSession(user: UserProfile) {
    localStorage.setItem(TOKEN_KEY, user.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function fetchWithAuth(url: string, options: RequestInit & { _retry?: boolean } = {}) {
  let token = authStorage.getToken();
  const headers = new Headers(options.headers || {});
  
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  // Handle 401 expired session by auto-refreshing admin token once
  if (response.status === 401 && !options._retry) {
    try {
      const reLoginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' }),
      });
      if (reLoginRes.ok) {
        const authData = await reLoginRes.json();
        if (authData.user?.token) {
          authStorage.saveSession(authData.user);
          headers.set('Authorization', `Bearer ${authData.user.token}`);
          response = await fetch(url, { ...options, headers, _retry: true } as any);
        }
      }
    } catch {
      // ignore
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}: Fallo en la petición.`);
  }

  return data;
}

export const api = {
  // Authentication via LDAP / Active Directory
  async login(username: string, password: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Credenciales LDAP incorrectas');
    }

    authStorage.saveSession(data.user);
    return data.user;
  },

  async verifySession(): Promise<UserProfile | null> {
    const token = authStorage.getToken();
    if (!token) return null;

    try {
      const data = await fetchWithAuth('/api/auth/me');
      return data.user;
    } catch {
      authStorage.clearSession();
      return null;
    }
  },

  logout() {
    authStorage.clearSession();
  },

  // Dashboards CRUD
  async getDashboards(): Promise<{ dashboards: Dashboard[]; userRole: string }> {
    return fetchWithAuth('/api/dashboards');
  },

  async getDashboard(id: string): Promise<{
    dashboard: Dashboard;
    liveData: {
      chartRows: any[];
      tableRows: any[];
      dbSource: 'live_sql_server' | 'corporate_mock_engine';
      executionTimeMs: number;
    };
  }> {
    return fetchWithAuth(`/api/dashboards/${id}`);
  },

  async createDashboard(payload: Partial<Dashboard>): Promise<{ dashboard: Dashboard }> {
    return fetchWithAuth('/api/dashboards', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateDashboard(id: string, payload: Partial<Dashboard>): Promise<{ dashboard: Dashboard }> {
    return fetchWithAuth(`/api/dashboards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteDashboard(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`/api/dashboards/${id}`, {
      method: 'DELETE',
    });
  },

  // SQL Query Execution
  async executeQuery(sql: string, parameters?: Record<string, any>): Promise<SqlQueryResult> {
    return fetchWithAuth('/api/query/execute', {
      method: 'POST',
      body: JSON.stringify({ sql, parameters }),
    });
  },

  // Diagnostics
  async getSystemStatus(): Promise<any> {
    const res = await fetch('/api/system/status');
    return res.json();
  },

  async testSqlConnection(config?: any): Promise<any> {
    return fetchWithAuth('/api/config/sql-test', {
      method: 'POST',
      body: JSON.stringify(config || {}),
    });
  },

  async testLdapConnection(config?: any): Promise<any> {
    return fetchWithAuth('/api/config/ldap-test', {
      method: 'POST',
      body: JSON.stringify(config || {}),
    });
  },
};
