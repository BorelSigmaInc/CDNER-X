'use client'

import { type FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import { api } from '@/lib/api'
import { readSession } from '@/lib/auth'

export default function PartnersPage() {
  const [user, setUser] = useState(readSession())
  const [dash, setDash] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({
    service_name: 'customer-bonded-01',
    user_email: '',
    sku: 'CDX-BOND-STD',
    region: 'eu-central',
    plan: 'standard',
  })

  const partnerId = user?.partner_id || (user?.role === 'partner' ? 1 : null)

  const refresh = () => {
    if (!partnerId) return
    api.partnerDashboard(partnerId)
      .then(setDash)
      .catch((err: Error) => setError(err.message))
  }

  useEffect(() => {
    setUser(readSession())
  }, [])

  useEffect(() => {
    refresh()
  }, [partnerId])

  const provision = (event: FormEvent) => {
    event.preventDefault()
    if (!partnerId) return
    setError('')
    api.provision({ partner_id: partnerId, ...form })
      .then((data) => {
        setNotice(String(data.message || 'Provisioned'))
        refresh()
      })
      .catch((err: Error) => setError(err.message))
  }

  const kpis = (dash?.kpis || {}) as Record<string, number>
  const partner = (dash?.partner || {}) as Record<string, string>
  const orders = (dash?.orders || []) as Record<string, unknown>[]
  const tickets = (dash?.tickets || []) as Record<string, unknown>[]

  return (
    <>
      <TopNav />
      <div className="page">
        <p className="eyebrow">CDNER-X / partners</p>
        <h1>Create bonded service</h1>
        <p className="lede">
          Vendor workspace to provision customer connectivity, track monthly sales, and run on-call.
          Patterned after a cloud “create database” flow — CDNER-X branded, not an IBM product page.
        </p>
        {error && <div className="banner error">{error}</div>}
        {notice && <div className="banner ok">{notice}</div>}

        {!user && (
          <p>Partner sign-in required. <Link href="/sign-in">Log in with a vendor CDNER-X ID</Link>.</p>
        )}

        <div className="grid-4" style={{ margin: '20px 0' }}>
          <article className="card kpi"><span className="label">Monthly sales</span><strong>${kpis.monthly_sales_usd ?? 0}</strong></article>
          <article className="card kpi"><span className="label">Active services</span><strong>{kpis.active_services ?? 0}</strong></article>
          <article className="card kpi"><span className="label">Provisioning</span><strong>{kpis.provisioning ?? 0}</strong></article>
          <article className="card kpi"><span className="label">Open on-call</span><strong>{kpis.open_on_call ?? 0}</strong></article>
        </div>

        <div className="grid-2">
          <form className="panel" onSubmit={provision}>
            <h2>Provisioning</h2>
            <p className="lede">{partner.company || 'Select a partner account'} · {partner.region}</p>
            <div className="field"><label>Service name</label><input value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} required /></div>
            <div className="field"><label>Customer CDNER-X ID</label><input type="email" value={form.user_email} onChange={(e) => setForm({ ...form, user_email: e.target.value })} required placeholder="user@example.com" /></div>
            <div className="field"><label>SKU</label>
              <select value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}>
                <option>CDX-BOND-STD</option>
                <option>CDX-BOND-ENT</option>
                <option>CDX-QKD-BB84</option>
                <option>CDX-QPATH-OPT</option>
              </select>
            </div>
            <div className="field"><label>Region</label>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                <option>eu-central</option><option>uk-south</option><option>us-east</option><option>ap-southeast</option>
              </select>
            </div>
            <div className="field"><label>Plan</label>
              <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option value="standard">Standard bonded access</option>
                <option value="plus">Plus with QKD</option>
                <option value="enterprise">Enterprise multi-site</option>
              </select>
            </div>
            <button className="btn" type="submit" disabled={!partnerId}>Create</button>
          </form>
          <section className="panel">
            <h2>On-call queue</h2>
            <table>
              <thead><tr><th>ID</th><th>Title</th><th>Sev</th><th>Status</th></tr></thead>
              <tbody>
                {tickets.length === 0 && <tr><td colSpan={4}>No open tickets.</td></tr>}
                {tickets.map((t) => (
                  <tr key={String(t.id)}><td>{String(t.id)}</td><td>{String(t.title)}</td><td>{String(t.severity)}</td><td>{String(t.status)}</td></tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Sales & services</h2>
          <table>
            <thead><tr><th>ID</th><th>Service</th><th>User</th><th>Region</th><th>Plan</th><th>USD/mo</th><th>Status</th></tr></thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={7}>No services yet.</td></tr>}
              {orders.map((o) => (
                <tr key={String(o.id)}>
                  <td>{String(o.id)}</td>
                  <td>{String(o.service_name)}</td>
                  <td>{String(o.user_id)}</td>
                  <td>{String(o.region)}</td>
                  <td>{String(o.plan)}</td>
                  <td>{String(o.monthly_usd)}</td>
                  <td>{String(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}
