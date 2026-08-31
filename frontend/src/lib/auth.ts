import type { AuthUser } from './api'

const KEY = 'cdnerx.session'

export function readSession(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function writeSession(user: AuthUser | null) {
  if (typeof window === 'undefined') return
  if (user) localStorage.setItem(KEY, JSON.stringify(user))
  else localStorage.removeItem(KEY)
}
