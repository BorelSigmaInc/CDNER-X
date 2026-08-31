import Link from 'next/link'
import TopNav from '@/components/TopNav'

export default function HomePage() {
  return (
    <>
      <TopNav />
      <div className="hero-band">
        <div className="page">
          <p className="eyebrow">CDNER-X cloud</p>
          <h1>Quantum-safe multi-path connectivity</h1>
          <p className="lede">
            Bond Starlink, 5G, and fiber, protect sessions with BB84, and buy or sell
            those services through registered CDNER-X vendors.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Link className="btn" href="/sign-in">Log in</Link>
            <Link className="btn secondary" href="/user">Estimate a service</Link>
            <Link className="btn ghost" href="/api-doc">API docs</Link>
          </div>
        </div>
      </div>
      <div className="page">
        <div className="grid-3">
          <article className="card">
            <h3>Customers</h3>
            <p className="lede">Price bonded access, QKD, and path optimization, then track provisioning.</p>
            <Link href="/user">Open CDNER-X/user</Link>
          </article>
          <article className="card">
            <h3>Partners</h3>
            <p className="lede">Provision customer services, watch sales, and run on-call tickets.</p>
            <Link href="/partners">Open CDNER-X/partners</Link>
          </article>
          <article className="card">
            <h3>Lab console</h3>
            <p className="lede">Live Yosemite engine, Bell-state path pick, and BB84 sifting.</p>
            <Link href="/console">Open lab</Link>
          </article>
        </div>
      </div>
    </>
  )
}
