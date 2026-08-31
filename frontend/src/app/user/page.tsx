'use client'

import { type FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import { api, type CatalogOffer, type Money } from '@/lib/api'
import { readSession } from '@/lib/auth'

function money(value: Money | undefined, usdFallback?: number) {
  if (value?.label) {
    return `${value.label} · USD ${value.usd.toFixed(2)}`
  }
  if (usdFallback != null) return `USD ${usdFallback.toFixed(2)}`
  return '—'
}

export default function UserPage() {
  const [user, setUser] = useState(readSession())
  const [catalog, setCatalog] = useState<CatalogOffer[]>([])
  const [currency, setCurrency] = useState('USD')
  const [qty, setQty] = useState<Record<string, number>>({})
  const [region, setRegion] = useState('eu-central')
  const [term, setTerm] = useState(12)
  const [fromSku, setFromSku] = useState('')
  const [estimate, setEstimate] = useState<Record<string, unknown> | null>(null)
  const [orders, setOrders] = useState<Record<string, unknown>[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [serviceName, setServiceName] = useState('site-edge-01')
  const [ticketTitle, setTicketTitle] = useState('Link flap on bonded path')

  const load = () => {
    api.catalog()
      .then((data) => {
        setCatalog(data.items)
        setCurrency(data.currency)
        const presetSku = new URLSearchParams(window.location.search).get('sku')
        if (presetSku && data.items.some((item) => item.sku === presetSku)) {
          setQty((current) => ({ ...current, [presetSku]: current[presetSku] || 1 }))
        }
      })
      .catch((err: Error) => setError(err.message))
  }

  useEffect(() => {
    setUser(readSession())
    load()
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
      setError('Add at least one CDNER machine.')
      return
    }
    setError('')
    api.estimate({
      user_id: user.user_id,
      region,
      term_months: term,
      items: selected,
      from_sku: fromSku || undefined,
    })
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
      plan: catalog.find((c) => c.sku === selected[0].sku)?.plan || 'standard',
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
        setNotice('On-call ticket opened with your CDNER partner.')
        return api.orders(user.user_id)
      })
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
  }

  const cleverUpgrade = (orderId: number) => {
    if (!user) return
    api.upgrade({ user_id: user.user_id, order_id: orderId, term_months: term })
      .then((data) => {
        setNotice(String(data.message))
        return api.orders(user.user_id)
      })
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
  }

  const monthly = estimate?.monthly as Money | undefined
  const setup = estimate?.setup as Money | undefined
  const contract = estimate?.contract as Money | undefined
  const credit = estimate?.upgrade_credit as Money | undefined
  const applied = (estimate?.discounts_applied || {}) as Record<string, number>
  const listMonthly = estimate?.list_monthly as Money | undefined

  return (
    <>
      <TopNav />
      <div className="page">
        <p className="eyebrow">CDNER-X / user</p>
        <h1>Subscribe to CDNER machines</h1>
        <p className="lede">
          Hardware-as-a-subscription from the CDNER product line (Edge S, Air ax³, Core 812, Data Server, Lamp 5G).
          Prices follow your location and are always shown with the USD equivalent. Term, volume, and upgrade credits stack.
        </p>
        <p className="lede">Detected currency: <strong>{currency}</strong></p>
        {error && <div className="banner error">{error}</div>}
        {notice && <div className="banner ok">{notice}</div>}
        {!user && <p>Need a CDNER-X ID? <Link href="/sign-in">Log in or create an ID</Link>.</p>}

        <div className="grid-2">
          <section className="panel">
            <h2>Machines</h2>
            {catalog.map((offer) => (
              <article key={offer.sku} className="card" style={{ marginBottom: 12 }}>
                <h3>{offer.name}</h3>
                <p className="lede">{offer.description}</p>
                <p className="lede">{offer.specs}</p>
                <p>
                  <strong>{money(offer.monthly)}/mo</strong>
                  {' · '}setup {money(offer.setup)}
                  {' · '}RRP {money(offer.retail)}
                </p>
                <p className="lede">{offer.partner} · {offer.sku}</p>
                {offer.upgrade_sku && <p className="lede">Clever upgrade → {offer.upgrade_sku}</p>}
                <label>Qty
                  <input type="number" min={0} max={20} value={qty[offer.sku] || 0} onChange={(e) => setQty({ ...qty, [offer.sku]: Number(e.target.value) })} />
                </label>
              </article>
            ))}
          </section>
          <section className="panel">
            <h2>Estimate</h2>
            <p className="lede">12 mo −5% · 24 mo −12% · 36 mo −20% · 3+ units −8% · upgrade credit 30% of residual.</p>
            <div className="field"><label>Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option>eu-central</option><option>uk-south</option><option>us-east</option><option>ap-southeast</option>
              </select>
            </div>
            <div className="field"><label>Term (months)</label>
              <input type="number" min={1} max={36} value={term} onChange={(e) => setTerm(Number(e.target.value))} />
            </div>
            <div className="field"><label>Upgrade from (optional)</label>
              <select value={fromSku} onChange={(e) => setFromSku(e.target.value)}>
                <option value="">New subscription</option>
                {catalog.filter((c) => c.upgrade_sku).map((c) => (
                  <option key={c.sku} value={c.sku}>{c.name}</option>
                ))}
              </select>
            </div>
            <button className="btn" type="button" onClick={quote}>Calculate estimate</button>
            {estimate && (
              <div className="card" style={{ marginTop: 16 }}>
                <p>List monthly {money(listMonthly)}</p>
                <p>After discounts {money(monthly)}</p>
                <p>Setup {money(setup)}</p>
                <p>Upgrade credit {money(credit)}</p>
                <p>Contract {money(contract)}</p>
                <p className="lede">Term {applied.term_percent || 0}% · volume {applied.volume_percent || 0}%</p>
              </div>
            )}
            <form onSubmit={orderFirst} style={{ marginTop: 24 }}>
              <h3>Request machine</h3>
              <div className="field"><label>Site name</label><input value={serviceName} onChange={(e) => setServiceName(e.target.value)} /></div>
              <button className="btn secondary" type="submit" disabled={!user || !selected.length}>Submit to vendor</button>
            </form>
          </section>
        </div>

        <section className="panel" style={{ marginTop: 16 }}>
          <h2>My subscriptions</h2>
          <div className="field"><label>On-call title</label><input value={ticketTitle} onChange={(e) => setTicketTitle(e.target.value)} /></div>
          <table>
            <thead><tr><th>ID</th><th>Machine</th><th>Region</th><th>USD/mo</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={6}>No machines yet.</td></tr>}
              {orders.map((o) => (
                <tr key={String(o.id)}>
                  <td>{String(o.id)}</td>
                  <td>{String(o.service_name)}</td>
                  <td>{String(o.region)}</td>
                  <td>{String(o.monthly_usd)}</td>
                  <td>{String(o.status)}</td>
                  <td>
                    <button className="btn ghost" type="button" onClick={() => raiseTicket(Number(o.id))}>On-call</button>
                    {' '}
                    <button className="btn ghost" type="button" onClick={() => cleverUpgrade(Number(o.id))}>Upgrade</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}
