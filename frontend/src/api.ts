export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8003'

export interface BondingPath {
  name: string
  kind: string
  bind: string
  target: string
}

export interface BondingStatus {
  status: string
  throughput: string
  latency: string
  interfaces: string[]
  active_sessions: number
  engine_running?: boolean
  engine_mode?: string
  paths?: BondingPath[]
  policy?: string
}

export interface BondingSession {
  id: number
  user_id: number
  status: string
  throughput: number | null
  latency: number | null
  created_at: string | null
}

export interface QuantumOptimizeResult {
  status: string
  selected_path: string
  counts: Record<string, number>
  quantum_result_id?: number
  algorithm?: string
  explanation?: string
}

export interface QKDResult {
  status: string
  sifted_key_length: number
  key: string
  key_masked?: string
  protocol?: string
  alice_bases: string[]
  bob_bases: string[]
  quantum_result_id?: number
}

export interface QuantumHistoryItem {
  id: number
  user_id: number
  algorithm: string
  result_data: string
  execution_time: number
  created_at: string
}

export interface AuthUser {
  user_id: number
  email: string
  role: 'customer' | 'operator'
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    if (typeof data.detail === 'string') return data.detail
    if (Array.isArray(data.detail)) {
      return data.detail.map((item: { msg?: string }) => item.msg || JSON.stringify(item)).join('; ')
    }
    return data.message || res.statusText
  } catch {
    return res.statusText || 'Request failed'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    throw new Error(await parseError(res))
  }
  return res.json() as Promise<T>
}

export const api = {
  health: () => request<{ status: string; quantum: string }>('/health'),
  bondingStatus: () => request<BondingStatus>('/api/bonding/status'),
  bondingSessions: (userId?: number | null, limit = 8) => {
    const query = new URLSearchParams({ limit: String(limit) })
    if (userId) query.set('user_id', String(userId))
    return request<BondingSession[]>(`/api/bonding/sessions?${query}`)
  },
  startBonding: (userId: number) =>
    request<{ status: string; session_id: number; message: string }>(
      `/api/bonding/start?user_id=${userId}`,
      { method: 'POST' },
    ),
  optimize: (userId: number) =>
    request<QuantumOptimizeResult>('/api/quantum/optimize', {
      method: 'POST',
      body: JSON.stringify({ paths: ['Starlink', '5G', 'Fiber'], user_id: userId }),
    }),
  generateQkd: (userId: number, numBits = 16) =>
    request<QKDResult>('/api/qkd/generate', {
      method: 'POST',
      body: JSON.stringify({ num_bits: numBits, user_id: userId }),
    }),
  quantumResults: (userId?: number | null, limit = 8) => {
    const query = new URLSearchParams({ limit: String(limit) })
    if (userId) query.set('user_id', String(userId))
    return request<QuantumHistoryItem[]>(`/api/quantum/results?${query}`)
  },
  login: (email: string, password: string) =>
    request<AuthUser & { status: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string) =>
    request<AuthUser & { status: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
}
