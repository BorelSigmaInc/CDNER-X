import type {
  BondingSession,
  BondingStatus,
  QKDResult,
  QuantumHistoryItem,
  QuantumOptimizeResult,
} from './api'

interface Props {
  apiBase: string
  health: string
  bonding: BondingStatus | null
  sessions: BondingSession[]
  quantum: QuantumOptimizeResult | null
  qkd: QKDResult | null
  history: QuantumHistoryItem[]
  loadingQuantum: boolean
  loadingQkd: boolean
  loadingHistory: boolean
  onOptimize: () => void
  onGenerateQkd: () => void
  onRefreshHistory: () => void
  onRefreshSessions: () => void
}

function formatCounts(counts?: Record<string, number>) {
  if (!counts) return '—'
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([bit, n]) => `${bit}:${n}`)
    .join('  ')
}

export default function InternalConsole({
  apiBase,
  health,
  bonding,
  sessions,
  quantum,
  qkd,
  history,
  loadingQuantum,
  loadingQkd,
  loadingHistory,
  onOptimize,
  onGenerateQkd,
  onRefreshHistory,
  onRefreshSessions,
}: Props) {
  return (
    <div className="console">
      <section className="console-banner">
        <p className="eyebrow">Internal console</p>
        <h2>Operator diagnostics</h2>
        <p className="lede">
          Raw engine, circuit, and key material for Borel Sigma operators. Not for customer display.
        </p>
      </section>

      <section className="diag-grid">
        <article>
          <span className="label">API</span>
          <code>{apiBase}</code>
        </article>
        <article>
          <span className="label">Health</span>
          <strong>{health || 'unknown'}</strong>
        </article>
        <article>
          <span className="label">Engine mode</span>
          <strong>{bonding?.engine_mode || '—'}</strong>
        </article>
        <article>
          <span className="label">Policy</span>
          <strong>{bonding?.policy || 'round-robin UDP'}</strong>
        </article>
      </section>

      <section>
        <div className="section-head">
          <h3>Interface binds</h3>
          <p>Loopback UDP endpoints used by the Rust bonding engine.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Path</th>
              <th>Kind</th>
              <th>Bind</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {(bonding?.paths || []).map((path) => (
              <tr key={path.name}>
                <td>{path.name}</td>
                <td>{path.kind}</td>
                <td><code>{path.bind}</code></td>
                <td><code>{path.target}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="two-col">
        <article className="card dark">
          <h3>Bell-state path pick</h3>
          <button className="btn" onClick={onOptimize} disabled={loadingQuantum}>
            {loadingQuantum ? 'Running circuit…' : 'Run optimize'}
          </button>
          {quantum && (
            <dl>
              <div><dt>Selected</dt><dd>{quantum.selected_path}</dd></div>
              <div><dt>Algorithm</dt><dd>{quantum.algorithm}</dd></div>
              <div><dt>Counts</dt><dd><code>{formatCounts(quantum.counts)}</code></dd></div>
              <div><dt>Result id</dt><dd>{quantum.quantum_result_id}</dd></div>
            </dl>
          )}
        </article>
        <article className="card dark">
          <h3>BB84 sifted key</h3>
          <button className="btn" onClick={onGenerateQkd} disabled={loadingQkd}>
            {loadingQkd ? 'Generating…' : 'Generate 16-bit QKD'}
          </button>
          {qkd && (
            <dl>
              <div><dt>Length</dt><dd>{qkd.sifted_key_length}</dd></div>
              <div><dt>Key</dt><dd><code className="key">{qkd.key || '—'}</code></dd></div>
              <div><dt>Alice</dt><dd><code>{qkd.alice_bases?.join(' ')}</code></dd></div>
              <div><dt>Bob</dt><dd><code>{qkd.bob_bases?.join(' ')}</code></dd></div>
            </dl>
          )}
        </article>
      </section>

      <section>
        <div className="section-head">
          <h3>Bonding sessions</h3>
          <button className="btn ghost" onClick={onRefreshSessions}>Refresh sessions</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 && (
              <tr><td colSpan={4}>No sessions recorded yet.</td></tr>
            )}
            {sessions.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.user_id}</td>
                <td>{row.status}</td>
                <td>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <div className="section-head">
          <h3>Quantum result log</h3>
          <button className="btn ghost" onClick={onRefreshHistory} disabled={loadingHistory}>
            {loadingHistory ? 'Loading…' : 'Refresh results'}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Algorithm</th>
              <th>Payload</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr><td colSpan={5}>No quantum rows yet.</td></tr>
            )}
            {history.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.user_id}</td>
                <td>{row.algorithm}</td>
                <td><code className="payload">{row.result_data}</code></td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
