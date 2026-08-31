import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

interface BondingStatus {
  status: string
  throughput: string
  latency: string
  interfaces: string[]
  active_sessions: number
}

interface QuantumResult {
  status: string
  selected_path: string
  counts: Record<string, number>
}

interface QKDResult {
  status: string
  sifted_key_length: number
  key: string
}

interface QuantumHistoryItem {
  id: number
  user_id: number
  algorithm: string
  result_data: string
  execution_time: number
  created_at: string
}

interface AuthResponse {
  status: string
  user_id: number
  email: string
}

function App() {
  const [bonding, setBonding] = useState<BondingStatus | null>(null)
  const [error, setError] = useState('')
  const [quantum, setQuantum] = useState<QuantumResult | null>(null)
  const [qkd, setQkd] = useState<QKDResult | null>(null)
  const [loadingQuantum, setLoadingQuantum] = useState(false)
  const [loadingQkd, setLoadingQkd] = useState(false)
  const [quantumHistory, setQuantumHistory] = useState<QuantumHistoryItem[]>([])

  // Auth state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState<number | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    fetch(`${API_BASE}/api/bonding/status`)
      .then((res) => res.json())
      .then((data) => setBonding(data))
      .catch((err) => setError(err.message))
  }, [])

  const handleAuth = () => {
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
    fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => { throw new Error(data.detail || 'Authentication failed') })
        }
        return res.json()
      })
      .then((data: AuthResponse) => {
        setUserId(data.user_id)
        setError('')
      })
      .catch((err) => setError(err.message))
  }

  const runQuantumOptimization = () => {
    setLoadingQuantum(true)
    fetch(`${API_BASE}/api/quantum/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['Starlink', '5G', 'Fiber'], user_id: userId ?? 1 })
    })
      .then((res) => res.json())
      .then((data) => setQuantum(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingQuantum(false))
  }

  const generateQKD = () => {
    setLoadingQkd(true)
    fetch(`${API_BASE}/api/qkd/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num_bits: 10, user_id: userId ?? 1 })
    })
      .then((res) => res.json())
      .then((data) => setQkd(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingQkd(false))
  }

  const fetchQuantumHistory = () => {
    const url = userId
      ? `${API_BASE}/api/quantum/results?limit=5&user_id=${userId}`
      : `${API_BASE}/api/quantum/results?limit=5`
    fetch(url)
      .then((res) => res.json())
      .then((data) => setQuantumHistory(data))
      .catch((err) => setError(err.message))
  }

  const startBondingSession = () => {
    if (!userId) {
      setError('Please log in first')
      return
    }
    fetch(`${API_BASE}/api/bonding/start?user_id=${userId}`, {
      method: 'POST'
    })
      .then((res) => res.json())
      .then((data) => {
        setError('')
        alert(`Bonding session started with ID ${data.session_id}`)
      })
      .catch((err) => setError(err.message))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Yosemite Quantum Bonding Engine</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Auth section */}
      <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
        <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={handleAuth}>{authMode === 'login' ? 'Login' : 'Register'}</button>
        <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ marginLeft: '0.5rem' }}>
          Switch to {authMode === 'login' ? 'Register' : 'Login'}
        </button>
        {userId && <p>Logged in as user ID: {userId}</p>}
      </div>

      {!bonding && !error && <p>Loading bonding status...</p>}
      {bonding && (
        <div>
          <h2>Bonding Status</h2>
          <p><strong>Status:</strong> {bonding.status}</p>
          <p><strong>Throughput:</strong> {bonding.throughput}</p>
          <p><strong>Latency:</strong> {bonding.latency}</p>
          <p><strong>Active Sessions:</strong> {bonding.active_sessions}</p>
          <p><strong>Interfaces:</strong> {bonding.interfaces.join(', ')}</p>
          <button onClick={startBondingSession}>Start Bonding Session</button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2>Quantum Path Optimization</h2>
        <button onClick={runQuantumOptimization} disabled={loadingQuantum}>
          {loadingQuantum ? 'Running...' : 'Optimize Path'}
        </button>
        {quantum && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Status:</strong> {quantum.status}</p>
            <p><strong>Selected Path:</strong> {quantum.selected_path}</p>
            <p><strong>Counts:</strong> {JSON.stringify(quantum.counts)}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Quantum Key Distribution (BB84)</h2>
        <button onClick={generateQKD} disabled={loadingQkd}>
          {loadingQkd ? 'Generating...' : 'Generate Key'}
        </button>
        {qkd && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Status:</strong> {qkd.status}</p>
            <p><strong>Sifted Key Length:</strong> {qkd.sifted_key_length}</p>
            <p><strong>Key:</strong> {qkd.key}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Recent Quantum Results</h2>
        <button onClick={fetchQuantumHistory}>Refresh Results</button>
        {quantumHistory.length > 0 && (
          <ul>
            {quantumHistory.map((result) => (
              <li key={result.id}>
                <strong>{result.algorithm}</strong> - {result.result_data} (created at {result.created_at})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
