import TopNav from '@/components/TopNav'

const GROUPS = [
  {
    title: 'Get started',
    items: ['What is CDNER-X', 'Hosting model', 'Dashboard overview', 'Pricing'],
  },
  {
    title: 'How to',
    items: ['Authenticate', 'Bond a session', 'Optimize a path', 'Generate BB84 keys', 'Estimate a service', 'Provision as a partner'],
  },
  {
    title: 'Reference',
    items: ['REST endpoints', 'Marketplace SKUs', 'Regions and plans'],
  },
]

export default function ApiDocPage() {
  return (
    <>
      <TopNav />
      <div className="docs-layout">
        <aside className="docs-nav">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <div className="group">{group.title}</div>
              {group.items.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</a>
              ))}
            </div>
          ))}
        </aside>
        <article className="docs-main">
          <p className="eyebrow">CDNER-X / api-doc</p>
          <h1>CDNER-X platform APIs</h1>
          <p className="lede">
            REST interface for quantum-safe bonding, QKD, partner provisioning, and customer estimates.
            Interactive OpenAPI lives at <code>/docs</code> on the API host.
          </p>

          <h2 id="what-is-cdner-x">What is CDNER-X</h2>
          <p>CDNER-X (Yosemite) bonds satellite, cellular, and fiber paths, then optionally protects the session with BB84 and sells those capabilities through registered vendors.</p>

          <h2 id="authenticate">Authenticate</h2>
<pre>{`POST /api/auth/register { email, password, role, company? }
POST /api/auth/login    { email, password }
`}</pre>
          <p>Roles: <code>customer</code>, <code>partner</code>, <code>operator</code>. Passwords are bcrypt-hashed. No IBM identity broker is used.</p>

          <h2 id="bond-a-session">Bond a session</h2>
<pre>{`GET  /api/bonding/status
GET  /api/bonding/sessions?user_id=
POST /api/bonding/start?user_id=
`}</pre>
          <p>In Docker the Rust engine is already running; start records a session instead of spawning a second process.</p>

          <h2 id="optimize-a-path">Optimize a path</h2>
<pre>{`POST /api/quantum/optimize
{ "paths": ["Starlink","5G","Fiber"], "user_id": 1 }`}</pre>

          <h2 id="generate-bb84-keys">Generate BB84 keys</h2>
<pre>{`POST /api/qkd/generate
{ "num_bits": 16, "user_id": 1 }`}</pre>
          <p>Customer UI shows <code>key_masked</code> only. Partner/lab consoles may show the sifted key.</p>

          <h2 id="estimate-a-service">Estimate a service</h2>
<pre>{`GET  /api/marketplace/catalog
GET  /api/marketplace/meta
POST /api/marketplace/estimate
POST /api/marketplace/orders
GET  /api/marketplace/orders?user_id=
`}</pre>

          <h2 id="provision-as-a-partner">Provision as a partner</h2>
<pre>{`GET  /api/marketplace/partners/dashboard?partner_id=
POST /api/marketplace/partners/provision
POST /api/marketplace/tickets
`}</pre>

          <h2 id="regions-and-plans">Regions and plans</h2>
          <p>Regions: eu-central, uk-south, us-east, ap-southeast. Plans: standard, plus (QKD), enterprise (multi-site).</p>

          <h2 id="rest-endpoints">Health</h2>
<pre>{`GET /health → { "status": "healthy", "quantum": "ready", "platform": "cdner-x" }`}</pre>
        </article>
      </div>
    </>
  )
}
