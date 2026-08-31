import Link from 'next/link'
import TopNav from '@/components/TopNav'

export default function HomePage() {
  return (
    <>
      <TopNav />
      <div className="hero-band">
        <div className="page">
          <p className="eyebrow">CDNER-X cloud</p>
          <h1>CDNER hardware, subscribed</h1>
          <p className="lede">
            Edge S, Air ax³, Core 812, Data Server, and Lamp 5G — managed subscriptions with location
            currency (USD equivalent), term discounts, and clever upgrades.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Link className="btn" href="/sign-in">Log in</Link>
            <Link className="btn secondary" href="/catalog">Open catalog</Link>
            <Link className="btn ghost" href="/user">Estimate a service</Link>
            <Link className="btn ghost" href="/api-doc">API docs</Link>
          </div>
        </div>
      </div>
      <div className="page">
        <div className="grid-3">
          <article className="card">
            <h3>Catalog</h3>
            <p className="lede">Browse Edge S, Air, Core, Lamp 5G, Data Server, and the full CDNER hardware line.</p>
            <Link href="/catalog">Open CDNER-X/catalog</Link>
          </article>
          <article className="card">
            <h3>Customers</h3>
            <p className="lede">Subscribe to CDNER machines, estimate in local currency, track upgrades.</p>
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
