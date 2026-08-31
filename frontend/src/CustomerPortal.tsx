import type { BondingStatus, QKDResult, QuantumOptimizeResult } from './api'

interface Props {
  bonding: BondingStatus | null
  selectedPath: string | null
  quantum: QuantumOptimizeResult | null
  qkd: QKDResult | null
  loadingBonding: boolean
  loadingQuantum: boolean
  loadingQkd: boolean
  loggedIn: boolean
  onStartBonding: () => void
  onOptimize: () => void
  onGenerateQkd: () => void
}

export default function CustomerPortal({
  bonding,
  selectedPath,
  quantum,
  qkd,
  loadingBonding,
  loadingQuantum,
  loadingQkd,
  loggedIn,
  onStartBonding,
  onOptimize,
  onGenerateQkd,
}: Props) {
  const active = bonding?.status === 'active'
  const paths = bonding?.paths?.length
    ? bonding.paths
    : (bonding?.interfaces || ['Starlink', '5G', 'Fiber']).map((name) => ({
        name,
        kind: name.toLowerCase(),
        bind: '',
        target: '',
      }))

  return (
    <div className="portal">
      <section className="hero-panel">
        <p className="eyebrow">Customer portal</p>
        <h2>One session. Three paths. Quantum-safe by default.</h2>
        <p className="lede">
          Yosemite bonds satellite, cellular, and fiber into a single connection, then
          protects the session with BB84 key distribution.
        </p>
        <div className="hero-actions">
          <button className="btn primary" onClick={onStartBonding} disabled={!loggedIn || loadingBonding}>
            {loadingBonding ? 'Starting…' : 'Start bonded session'}
          </button>
          {!loggedIn && <span className="hint">Sign in to start a session.</span>}
        </div>
      </section>

      <section className="metrics">
        <article>
          <span className="label">Link</span>
          <strong className={active ? 'ok' : 'off'}>{active ? 'Bonded' : 'Standby'}</strong>
        </article>
        <article>
          <span className="label">Throughput</span>
          <strong>{bonding?.throughput ?? '—'}</strong>
        </article>
        <article>
          <span className="label">Latency</span>
          <strong>{bonding?.latency ?? '—'}</strong>
        </article>
        <article>
          <span className="label">Preferred path</span>
          <strong>{selectedPath || quantum?.selected_path || 'Not chosen yet'}</strong>
        </article>
      </section>

      <section>
        <div className="section-head">
          <h3>Bonded paths</h3>
          <p>Traffic is striped across every live interface.</p>
        </div>
        <div className="path-grid">
          {paths.map((path) => {
            const preferred = (selectedPath || quantum?.selected_path) === path.name
            return (
              <article key={path.name} className={`path-card ${preferred ? 'preferred' : ''}`}>
                <header>
                  <span className={`pulse ${active ? 'on' : ''}`} />
                  <h4>{path.name}</h4>
                </header>
                <p className="kind">{path.kind}</p>
                {preferred && <em>Recommended egress</em>}
              </article>
            )
          })}
        </div>
      </section>

      <section className="two-col">
        <article className="card">
          <h3>Path recommendation</h3>
          <p>Ask the engine which bonded path should carry the next sensitive burst.</p>
          <button className="btn" onClick={onOptimize} disabled={!loggedIn || loadingQuantum}>
            {loadingQuantum ? 'Sampling…' : 'Recommend path'}
          </button>
          {quantum && (
            <p className="result">
              {quantum.explanation || `Selected path: ${quantum.selected_path}`}
            </p>
          )}
        </article>
        <article className="card">
          <h3>Session protection</h3>
          <p>Establish a BB84 sifted key for this login. The raw key stays off this screen.</p>
          <button className="btn" onClick={onGenerateQkd} disabled={!loggedIn || loadingQkd}>
            {loadingQkd ? 'Sifting…' : 'Protect this session'}
          </button>
          {qkd && (
            <p className="result">
              {qkd.protocol || 'BB84'} key established · {qkd.sifted_key_length} sifted bits
              {qkd.key_masked ? ` · ${qkd.key_masked}` : ''}
            </p>
          )}
        </article>
      </section>
    </div>
  )
}
