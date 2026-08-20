/* ============================================================
   HighLyAgent Manager — backend transport layer
   ============================================================
   Runtime configuration:
   • build-time : VITE_API_URL / VITE_WS_URL / VITE_API_KEY / VITE_SIMULATED
   • runtime    : localStorage overrides (hla.api / hla.ws / hla.key)
   ============================================================ */

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AgentReply {
  task_id: string;
  text: string;
  source: 'knowledge' | 'ai';
  similarity: number;
  tools: string[];
  tokens: number;
  cost_usd: number;
  latency_ms: number;
}

export interface ApiKeyResponse {
  key: { id: string; client_id: string; last4: string; label: string; revoked: boolean };
  visible_key: string;
}

const read = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const env = import.meta.env as Record<string, string | undefined>;

export const API_URL = (read('hla.api') || env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
export const WS_URL = read('hla.ws') || env.VITE_WS_URL || `${API_URL.replace(/^http/, 'ws')}/ws`;
export const API_KEY = read('hla.key') || env.VITE_API_KEY || '';
export const SIMULATED = (env.VITE_SIMULATED ?? 'false') !== 'false';

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  // Auth endpoints are intentionally excluded. Every protected Manager request
  // carries X-API-Key; caller-provided keys are preserved for project-scoped APIs.
  if (API_KEY && !path.startsWith('/auth/') && !headers.has('X-API-Key')) {
    headers.set('X-API-Key', API_KEY);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the HighLyAgent backend. Check the API URL and server status.');
  }

  if (!res.ok) {
    let code = `HTTP_${res.status}`;
    let message = res.statusText || 'Request failed';

    if (res.status === 401) { code = 'INVALID_KEY'; message = 'Authentication or API key is invalid or missing.'; }
    else if (res.status === 403) { code = 'ACCESS_DENIED'; message = 'Project ID and API key do not match, or access is denied.'; }

    try {
      const body = (await res.json()) as { detail?: { code?: string; message?: string } | string };
      if (body?.detail) {
        if (typeof body.detail === 'string') message = body.detail;
        else { message = body.detail.message ?? message; code = body.detail.code ?? code; }
      }
    } catch { /* non-JSON error body */ }
    throw new ApiError(res.status, code, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export const api = {
  health: () => http<{ status: string; version: string }>('/health'),

  setup: (username: string, email: string, password: string) =>
    http<TokenPair>('/auth/setup', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  login: (identifier: string, password: string) =>
    http<TokenPair>('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }),
  refresh: (refresh_token: string) =>
    http<TokenPair>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token }) }),
  me: (token: string) => http<{ sub: string; role: string }>('/auth/me', { headers: bearer(token) }),

  projects: (token: string) => http<any[]>('/projects', { headers: bearer(token) }),
  createProject: (token: string, body: { name: string; type: string; env: string; desc: string }) =>
    http<{ client: any; key: ApiKeyResponse }>('/projects', { method: 'POST', headers: bearer(token), body: JSON.stringify(body) }),
  updateProject: (token: string, projectId: string, patch: Record<string, any>) =>
    http<any>(`/projects/${projectId}`, { method: 'PATCH', headers: bearer(token), body: JSON.stringify(patch) }),
  deleteProject: (token: string, projectId: string) =>
    http<void>(`/projects/${projectId}`, { method: 'DELETE', headers: bearer(token) }),
  rotateKey: (token: string, projectId: string) =>
    http<ApiKeyResponse>(`/projects/${projectId}/keys/rotate`, { method: 'POST', headers: bearer(token) }),
  listKnowledge: (token: string, projectId: string) => http<any[]>(`/projects/${projectId}/knowledge`, { headers: bearer(token) }),
  addKnowledge: (token: string, projectId: string, body: any) =>
    http<any>(`/projects/${projectId}/knowledge`, { method: 'POST', headers: bearer(token), body: JSON.stringify(body) }),
  listTools: (token: string) => http<any[]>('/tools', { headers: bearer(token) }),
  listUsers: (token: string, projectId: string) => http<any[]>(`/projects/${projectId}/users`, { headers: bearer(token) }),
  systemHealth: (token: string) => http<any>('/system/health', { headers: bearer(token) }),

  agentProcess: (clientId: string, apiKey: string, body: { user_ref: string; text: string }) =>
    http<AgentReply>('/agent/process', {
      method: 'POST',
      headers: { 'X-Client-Id': clientId, 'X-API-Key': apiKey },
      body: JSON.stringify(body),
    }),
};

export interface GatewayHandle {
  send: (frame: Record<string, unknown>) => void;
  close: () => void;
}

export function connectGateway(
  params: { clientId: string; apiKey?: string; token?: string },
  on: {
    onFrame: (frame: Record<string, unknown>) => void;
    onOpen?: () => void;
    onClose?: (code: number, reason: string) => void;
    onError?: (error: Event) => void;
  },
): GatewayHandle {
  const qs = new URLSearchParams({ client_id: params.clientId });
  if (params.apiKey) qs.set('api_key', params.apiKey);
  if (params.token) qs.set('token', params.token);

  const ws = new WebSocket(`${WS_URL}?${qs.toString()}`);
  const hb = window.setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.send('{"type":"pong"}');
  }, 25_000);

  ws.onmessage = (ev) => {
    try { on.onFrame(JSON.parse(String(ev.data)) as Record<string, unknown>); } catch { /* malformed frame */ }
  };
  ws.onopen = () => on.onOpen?.();
  ws.onclose = (ev) => { window.clearInterval(hb); on.onClose?.(ev.code, ev.reason); };
  ws.onerror = (ev) => on.onError?.(ev);

  return {
    send: (frame) => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(frame)); },
    close: () => { window.clearInterval(hb); ws.close(); },
  };
}

export const overrides = {
  setApi: (url: string) => { try { localStorage.setItem('hla.api', url); } catch { /* private mode */ } },
  setWs: (url: string) => { try { localStorage.setItem('hla.ws', url); } catch { /* private mode */ } },
  setKey: (key: string) => { try { localStorage.setItem('hla.key', key); } catch { /* private mode */ } },
  clear: () => {
    try {
      localStorage.removeItem('hla.api');
      localStorage.removeItem('hla.ws');
      localStorage.removeItem('hla.key');
    } catch { /* ignore */ }
  },
};
