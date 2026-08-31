'use client'

import { type FormEvent, useEffect, useState } from 'react'
import TopNav from '@/components/TopNav'
import { api } from '@/lib/api'
import { readSession } from '@/lib/auth'

export default function ConsolePage() {
  const [user, setUser] = useState(readSession())
  const [bonding, setBonding] = useState<Record<string, unknown> | null>(null)
  const [quantum, setQuantum] = useState<Record<string, unknown> | null>(null)
  const [qkd, setQkd] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setUser(readSession())
    api.bondingStatus().then(setBonding).catch((err: Error) => setError(err.message))
  }, [])

  const start = (event: FormEvent) => {
    event.preventDefault()
    if (!user) { setError('Sign in first.'); return }
    api.startBonding(user.user_id)
      .then((data) => { setNotice(String(data.message)); return api.bondingStatus() })
      .then(setBonding)
      .catch((err: Error) => setError(err.message))
  }

  return (
    <>
      <TopNav />
      <div className="page">
        <p className="eyebrow">CDNER-X lab console</p>
        <h1>Yosemite bonding engine</h1>
        {error && <div className="banner error">{error}</div>}
        {notice && <div className="banner ok">{notice}</div>}
        <div className="grid-4">
          <article className="card kpi"><span className="label">Link</span><strong>{String(bonding?.status || '—')}</strong></article>
          <article className="card kpi"><span className="label">Throughput</span><strong>{String(bonding?.throughput || '—')}</strong></article>
          <article className="card kpi"><span className="label">Latency</span><strong>{String(bonding?.latency || '—')}</strong></article>
          <article className="card kpi"><span className="label">Engine</span><strong>{String(bonding?.engine_mode || '—')}</strong></article>
        </div>
        <div className="grid-3" style={{ marginTop: 16 }}>
          <form className="panel" onSubmit={start}>
            <h2>Bonded session</h2>
            <p className="lede">{String(bonding?.policy || '')}</p>
            <button className="btn" type="submit">Start bonded session</button>
          </form>
          <section className="panel">
            <h2>Path recommendation</h2>
            <button className="btn secondary" type="button" onClick={() => user && api.optimize(user.user_id).then(setQuantum).catch((e: Error) => setError(e.message))}>Recommend path</button>
            {quantum && <p>{String(quantum.explanation || quantum.selected_path)}</p>}
          </section>
          <section className="panel">
            <h2>Session protection</h2>
            <button className="btn secondary" type="button" onClick={() => user && api.generateQkd(user.user_id).then(setQkd).catch((e: Error) => setError(e.message))}>Protect this session</button>
            {qkd && <p>BB84 · {String(qkd.sifted_key_length)} bits · {String(qkd.key_masked)}</p>}
          </section>
        </div>
      </div>
    </>
  )
}
