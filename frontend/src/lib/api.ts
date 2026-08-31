export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '')

export type Role = 'customer' | 'partner' | 'operator'

export interface AuthUser {
  user_id: number
  email: string
  role: Role
  partner_id?: number | null
}

export interface Money {
  usd: number
  amount: number
  currency: string
  rate: number
  symbol: string
  label: string
}

export interface CatalogOffer {
  id: number
  sku: string
  name: string
  category: string
  family?: string
  plan: string
  specs?: string
  description: string
  upgrade_sku?: string | null
  monthly_usd: number
  setup_usd: number
  retail_usd: number
  monthly: Money
  setup: Money
  retail: Money
  partner_id: number
  partner?: string | null
  region?: string | null
}

export interface CatalogResponse {
  currency: string
  items: CatalogOffer[]
  upgrades: Record<string, string>
  discounts: {
    term: { months: number; percent: number }[]
    volume: { qty: number; percent: number }[]
    upgrade_credit_percent: number
  }
}

export function detectLocale() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigator.language
  return { tz, language }
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
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<T>
}

const locQuery = () => {
  if (typeof window === 'undefined') return ''
  const { tz } = detectLocale()
  return `tz=${encodeURIComponent(tz)}`
}

export const api = {
  health: () => request<{ status: string; quantum: string }>('/health'),
  login: (email: string, password: string) =>
    request<AuthUser & { status: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, role: Role = 'customer', company?: string) =>
    request<AuthUser & { status: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, company }),
    }),
  catalog: () => request<CatalogResponse>(`/api/marketplace/catalog?${locQuery()}`),
  fx: () => request<{ currency: string; usd_rate: number; symbol: string }>(`/api/marketplace/fx?${locQuery()}`),
  meta: () => request<{ regions: string[]; plans: { id: string; label: string }[] }>(`/api/marketplace/meta?${locQuery()}`),
  estimate: (payload: object) =>
    request<Record<string, unknown>>('/api/marketplace/estimate', {
      method: 'POST',
      body: JSON.stringify({ ...payload, ...detectLocale() }),
    }),
  orders: (userId?: number, partnerId?: number) => {
    const q = new URLSearchParams()
    if (userId) q.set('user_id', String(userId))
    if (partnerId) q.set('partner_id', String(partnerId))
    return request<Record<string, unknown>[]>(`/api/marketplace/orders?${q}`)
  },
  placeOrder: (payload: object) => request<Record<string, unknown>>('/api/marketplace/orders', { method: 'POST', body: JSON.stringify(payload) }),
  upgrade: (payload: object) => request<Record<string, unknown>>('/api/marketplace/upgrade', { method: 'POST', body: JSON.stringify(payload) }),
  tickets: (opts: { partnerId?: number; userId?: number } = {}) => {
    const q = new URLSearchParams()
    if (opts.partnerId) q.set('partner_id', String(opts.partnerId))
    if (opts.userId) q.set('user_id', String(opts.userId))
    return request<Record<string, unknown>[]>(`/api/marketplace/tickets?${q}`)
  },
  openTicket: (payload: object) => request<Record<string, unknown>>('/api/marketplace/tickets', { method: 'POST', body: JSON.stringify(payload) }),
  partners: () => request<Record<string, unknown>[]>('/api/marketplace/partners'),
  partnerDashboard: (partnerId: number) => request<Record<string, unknown>>(`/api/marketplace/partners/dashboard?partner_id=${partnerId}`),
  provision: (payload: object) => request<Record<string, unknown>>('/api/marketplace/partners/provision', { method: 'POST', body: JSON.stringify(payload) }),
  bondingStatus: () => request<Record<string, unknown>>('/api/bonding/status'),
  startBonding: (userId: number) => request<Record<string, unknown>>(`/api/bonding/start?user_id=${userId}`, { method: 'POST' }),
  optimize: (userId: number) =>
    request<Record<string, unknown>>('/api/quantum/optimize', {
      method: 'POST',
      body: JSON.stringify({ paths: ['Starlink', '5G', 'Fiber'], user_id: userId }),
    }),
  generateQkd: (userId: number) =>
    request<Record<string, unknown>>('/api/qkd/generate', {
      method: 'POST',
      body: JSON.stringify({ num_bits: 16, user_id: userId }),
    }),
}
