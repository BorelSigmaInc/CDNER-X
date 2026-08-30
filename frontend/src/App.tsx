import { useEffect, useState } from 'react'

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

function App() {
  const [bonding, setBonding] = useState<BondingStatus | null>(null)
  const [error, setError] = useState('')
  const [quantum, setQuantum] = useState<QuantumResult | null>(null)
  const [qkd, setQkd] = useState<QKDResult | null>(null)
  const [loadingQuantum, setLoadingQuantum] = useState(false)
  const [loadingQkd, setLoadingQkd] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/bonding/status')
      .then((res) => res.json())
      .then((data) => setBonding(data))
      .catch((err) => setError(err.message))
  }, [])

  const runQuantumOptimization = () => {
    setLoadingQuantum(true)
    fetch('http://127.0.0.1:8000/api/quantum/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['Starlink', '5G', 'Fiber'] })
    })
      .then((res) => res.json())
      .then((data) => setQuantum(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingQuantum(false))
  }

  const generateQKD = () => {
    setLoadingQkd(true)
    fetch('http://127.0.0.1:8000/api/qkd/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num_bits: 10 })
    })
      .then((res) => res.json())
      .then((data) => setQkd(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingQkd(false))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Yosemite Quantum Bonding Engine</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!bonding && !error && <p>Loading bonding status...</p>}
      {bonding && (
        <div>
          <h2>Bonding Status</h2>
          <p><strong>Status:</strong> {bonding.status}</p>
          <p><strong>Throughput:</strong> {bonding.throughput}</p>
          <p><strong>Latency:</strong> {bonding.latency}</p>
          <p><strong>Active Sessions:</strong> {bonding.active_sessions}</p>
          <p><strong>Interfaces:</strong> {bonding.interfaces.join(', ')}</p>
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
    </div>
  )
}

export default App
