import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { API_BASE, api, type AuthUser, type BondingSession, type BondingStatus, type QKDResult, type QuantumHistoryItem, type QuantumOptimizeResult } from './api'
import CustomerPortal from './CustomerPortal'
import InternalConsole from './InternalConsole'

type View = 'customer' | 'internal'
const SESSION_KEY = 'yosemite.session'

function viewFromHash(): View {
  return window.location.hash.replace('#', '') === 'internal' ? 'internal' : 'customer'
}

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function App() {
  const [view, setView] = useState<View>(viewFromHash)
  const [user, setUser] = useState<AuthUser | null>(readSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [health, setHealth] = useState('')
  const [bonding, setBonding] = useState<BondingStatus | null>(null)
  const [sessions, setSessions] = useState<BondingSession[]>([])
  const [quantum, setQuantum] = useState<QuantumOptimizeResult | null>(null)
  const [qkd, setQkd] = useState<QKDResult | null>(null)
  const [history, setHistory] = useState<QuantumHistoryItem[]>([])
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loadingBonding, setLoadingBonding] = useState(false)
  const [loadingQuantum, setLoadingQuantum] = useState(false)
  const [loadingQkd, setLoadingQkd] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)

  const userId = user?.user_id ?? null

  const switchView = (next: View) => {
    setView(next)
    window.location.hash = next
  }

  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const refreshBonding = useCallback(() => {
    return api.bondingStatus()
      .then(setBonding)
      .catch((err: Error) => setError(err.message))
  }, [])

  const refreshSessions = useCallback(() => {
    const scoped = view === 'customer' ? userId : null
    return api.bondingSessions(scoped)
      .then(setSessions)
      .catch((err: Error) => setError(err.message))
  }, [view, userId])

  const refreshHistory = useCallback(() => {
    setLoadingHistory(true)
    const scoped = view === 'customer' ? userId : null
    return api.quantumResults(scoped, view === 'internal' ? 12 : 5)
      .then(setHistory)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingHistory(false))
  }, [view, userId])

  useEffect(() => {
    api.health()
      .then((data) => setHealth(`${data.status} · quantum ${data.quantum}`))
      .catch(() => setHealth('unreachable'))
    refreshBonding()
  }, [refreshBonding])

  useEffect(() => {
    refreshSessions()
    refreshHistory()
  }, [refreshSessions, refreshHistory])

  const persistUser = (next: AuthUser | null) => {
    setUser(next)
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    else localStorage.removeItem(SESSION_KEY)
  }

  const handleAuth = (event: FormEvent) => {
    event.preventDefault()
    setLoadingAuth(true)
    setError('')
    const action = authMode === 'login' ? api.login : api.register
    action(email, password)
      .then((data) => {
        persistUser({
          user_id: data.user_id,
          email: data.email,
          role: data.role === 'operator' ? 'operator' : 'customer',
        })
        setNotice(authMode === 'login' ? 'Signed in.' : 'Account created.')
        setPassword('')
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingAuth(false))
  }

  const startBondingSession = () => {
    if (!userId) {
      setError('Sign in to start a bonded session.')
      return
    }
    setLoadingBonding(true)
    setError('')
    api.startBonding(userId)
      .then((data) => {
        setNotice(data.message || `Session ${data.session_id} recorded.`)
        return Promise.all([refreshBonding(), refreshSessions()])
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingBonding(false))
  }

  const runQuantumOptimization = () => {
    setLoadingQuantum(true)
    setError('')
    api.optimize(userId ?? 1)
      .then((data) => {
        setQuantum(data)
        setNotice(`Preferred path: ${data.selected_path}`)
        return refreshHistory()
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingQuantum(false))
  }

  const generateQKD = () => {
    if (!userId && view === 'customer') {
      setError('Sign in to protect this session.')
      return
    }
    setLoadingQkd(true)
    setError('')
    api.generateQkd(userId ?? 1)
      .then((data) => {
        setQkd(data)
        setNotice(view === 'customer'
          ? `Session protection ready (${data.sifted_key_length} sifted bits).`
          : `BB84 key length ${data.sifted_key_length}.`)
        return refreshHistory()
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingQkd(false))
  }

  const selectedPath = quantum?.selected_path ?? null

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="mark">Y</span>
          <div>
            <strong>Yosemite</strong>
            <small>CDNER-X · quantum bonding</small>
          </div>
        </div>
        <nav className="view-switch" aria-label="Application views">
          <button
            className={view === 'customer' ? 'active' : ''}
            onClick={() => switchView('customer')}
          >
            Customer
          </button>
          <button
            className={view === 'internal' ? 'active' : ''}
            onClick={() => switchView('internal')}
          >
            Internal
          </button>
        </nav>
        <div className="session">
          {user ? (
            <>
              <span>{user.email}</span>
              <button className="btn ghost" onClick={() => persistUser(null)}>Sign out</button>
            </>
          ) : (
            <span className="muted">Guest</span>
          )}
        </div>
      </header>

      {error && <div className="banner error" role="alert">{error}</div>}
      {notice && !error && <div className="banner ok">{notice}</div>}

      {!user && (
        <form className="auth" onSubmit={handleAuth}>
          <div>
            <h2>{authMode === 'login' ? 'Sign in' : 'Create account'}</h2>
            <p>Use the same account for the customer portal. Internal tools share this login.</p>
          </div>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            required
            minLength={authMode === 'register' ? 6 : 1}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
          />
          <button className="btn primary" type="submit" disabled={loadingAuth}>
            {loadingAuth ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Register'}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>
        </form>
      )}

      {view === 'customer' ? (
        <CustomerPortal
          bonding={bonding}
          selectedPath={selectedPath}
          quantum={quantum}
          qkd={qkd}
          loadingBonding={loadingBonding}
          loadingQuantum={loadingQuantum}
          loadingQkd={loadingQkd}
          loggedIn={Boolean(user)}
          onStartBonding={startBondingSession}
          onOptimize={runQuantumOptimization}
          onGenerateQkd={generateQKD}
        />
      ) : (
        <InternalConsole
          apiBase={API_BASE}
          health={health}
          bonding={bonding}
          sessions={sessions}
          quantum={quantum}
          qkd={qkd}
          history={history}
          loadingQuantum={loadingQuantum}
          loadingQkd={loadingQkd}
          loadingHistory={loadingHistory}
          onOptimize={runQuantumOptimization}
          onGenerateQkd={generateQKD}
          onRefreshHistory={refreshHistory}
          onRefreshSessions={refreshSessions}
        />
      )}
    </div>
  )
}

export default App
