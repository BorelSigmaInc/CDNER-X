'use client'

import { type FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import { api, type CatalogOffer } from '@/lib/api'
import { readSession } from '@/lib/auth'

export default function UserPage() {
  const [user, setUser] = useState(readSession())
  const [catalog, setCatalog] = useState<CatalogOffer[]>([])
  const [qty, setQty] = useState<Record<string, number>>({})
  const [region, setRegion] = useState('eu-central')
  const [term, setTerm] = useState(12)
  const [estimate, setEstimate] = useState<Record<string, unknown> | null>(null)
  const [orders, setOrders] = useState<Record<string, unknown>[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [serviceName, setServiceName] = useState('my-bonded-link')
  const [ticketTitle, setTicketTitle] = useState('Path flap on fiber leg')

  useEffect(() => {
    setUser(readSession())
    api.catalog().then(setCatalog).catch((err: Error) => setError(err.message))
  }, [])

  useEffect(() => {
    if (!user) return
    api.orders(user.user_id).then(setOrders).catch((err: Error) => setError(err.message))
  }, [user])

  const selected = useMemo(
    () => catalog.filter((o) => (qty[o.sku] || 0) > 0).map((o) => ({ sku: o.sku, quantity: qty[o.sku] })),
    [catalog, qty],
  )

  const quote = () => {
    if (!user) {
      setError('Log in to save an estimate.')
      return
    }
    if (!selected.length) {
      setError('Add at least one catalog item.')
      return
    }
    setError('')
    api.estimate({ user_id: user.user_id, region, term_months: term, items: selected })
      .then(setEstimate)
      .catch((err: Error) => setError(err.message))
  }

  const orderFirst = (event: FormEvent) => {
    event.preventDefault()
    if (!user || !selected.length) return
    api.placeOrder({
      user_id: user.user_id,
      sku: selected[0].sku,
      service_name: serviceName,
      region,
      plan: 'standard',
    })
      .then((data) => {
        setNotice(String(data.message))
        return api.orders(user.user_id)
      })
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
  }

  const raiseTicket = (orderId: number) => {
    if (!user) return
    api.openTicket({ user_id: user.user_id, order_id: orderId, title: ticketTitle, severity: 'high' })
      .then(() => {
        setNotice('On-call ticket opened with your vendor.')
        return api.orders(user.user_id)
      })
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
  }

  return (
    <>
      <TopNav />
      <div className="page">
        <p className="eyebrow">CDNER-X / user</p>
        <h1>Cost estimator & service tracking</h1>
        <p className="lede">
          Choose vendor SKUs, estimate contract cost, request provisioning, and track on-call.
          Inspired by a cloud cost estimator — CDNER-X pricing only.
        </p>
        {error && <div className="banner error">{error}</div>}
        {notice && <div className="banner ok">{notice}</div>}
        {!user && <p>Need a CDNER-X ID? <Link href="/sign-in">Log in or create an ID</Link>.</p>}

        <div className="grid-2">
          <section className="panel">
            <h2>Catalog</h2>
            {catalog.map((offer) => (
              <article key={offer.sku} className="card" style={{ marginBottom: 12 }}>
                <h3>{offer.name}</h3>
                <p className="lede">{offer.description}</p>
                <p><strong>${offer.monthly_usd}/mo</strong> · setup ${offer.setup_usd} · {offer.partner}</p>
                <label>Qty
                  <input type="number" min={0} max={20} value={qty[offer.sku] || 0} onChange={(e) => setQty({ ...qty, [offer.sku]: Number(e.target.value) })} />
                </label>
              </article>
            ))}
          </section>
          <section className="panel">
            <h2>Estimate</h2>
            <div className="field"><label>Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option>eu-central</option><option>uk-south</option><option>us-east</option><option>ap-southeast</option>
              </select>
            </div>
            <div className="field"><label>Term (months)</label>
              <input type="number" min={1} max={36} value={term} onChange={(e) => setTerm(Number(e.target.value))} />
            </div>
            <button className="btn" type="button" onClick={quote}>Calculate estimate</button>
            {estimate && (
              <div className="card" style={{ marginTop: 16 }}>
                <p>Monthly <strong>${String(estimate.monthly_usd)}</strong></p>
                <p>Setup <strong>${String(estimate.setup_usd)}</strong></p>
                <p>Contract <strong>${String(estimate.contract_usd)}</strong></p>
              </div>
            )}
            <form onSubmit={orderFirst} style={{ marginTop: 24 }}>
              <h3>Request service</h3>
              <div className="field"><label>Service name</label><input value={serviceName} onChange={(e) => setServiceName(e.target.value)} /></div>
              <button className="btn secondary" type="submit" disabled={!user || !selected.length}>Submit to vendor</button>
            </form>
          </section>
        </div>

        <section className="panel" style={{ marginTop: 16 }}>
          <h2>My services</h2>
          <div className="field"><label>On-call title</label><input value={ticketTitle} onChange={(e) => setTicketTitle(e.target.value)} /></div>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Region</th><th>USD/mo</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={6}>No services yet.</td></tr>}
              {orders.map((o) => (
                <tr key={String(o.id)}>
                  <td>{String(o.id)}</td>
                  <td>{String(o.service_name)}</td>
                  <td>{String(o.region)}</td>
                  <td>{String(o.monthly_usd)}</td>
                  <td>{String(o.status)}</td>
                  <td><button className="btn ghost" type="button" onClick={() => raiseTicket(Number(o.id))}>Open on-call</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}
