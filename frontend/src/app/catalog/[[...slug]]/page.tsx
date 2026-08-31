import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProductGrid from '@/components/ProductGrid'
import CatalogPrice from '@/components/CatalogPrice'
import {
  ALIASES,
  ARTICLE_BY_PATH,
  FEATURED,
  GROUP_BY_SLUG,
  GROUPS,
  HIGHLIGHTS,
  PRODUCT_BY_SLUG,
  PRODUCTS,
  allCatalogStaticParams,
  catalogHref,
  resolveCatalogPath,
} from '@/lib/catalog-data'

type Props = { params: Promise<{ slug?: string[] }> }

export function generateStaticParams() {
  return allCatalogStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const path = resolveCatalogPath(slug)
  if (path === '/') {
    return { title: 'CDNER catalog · CDNER-X', description: 'CDNER hardware, software, and training. Subscribe in local currency.' }
  }
  if (path.startsWith('/product/')) {
    const product = PRODUCT_BY_SLUG[path.slice('/product/'.length)]
    if (product) return { title: `${product.name} · CDNER catalog`, description: product.description }
  }
  if (path.startsWith('/products/group/')) {
    const group = GROUP_BY_SLUG[path.slice('/products/group/'.length)]
    if (group) return { title: `${group.title} · CDNER catalog`, description: group.blurb }
  }
  const article = ARTICLE_BY_PATH[path]
  if (article) return { title: `${article.title} · CDNER catalog`, description: article.lede }
  return { title: 'CDNER catalog · CDNER-X' }
}

export default async function CatalogPage({ params }: Props) {
  const { slug } = await params
  const raw = `/${(slug || []).join('/')}`
  const path = raw === '/' ? '/' : raw.replace(/\/$/, '')
  if (ALIASES[path]) redirect(catalogHref(ALIASES[path]))

  const resolved = resolveCatalogPath(slug)

  if (resolved === '/') return <HomeView />
  if (resolved === '/hardware' || resolved === '/products') {
    const article = ARTICLE_BY_PATH[resolved]
    return (
      <div className="page catalog-page">
        <p className="eyebrow">CDNER-X / catalog{resolved}</p>
        <h1>{article?.title || 'Products'}</h1>
        <p className="lede">{article?.lede}</p>
        <ProductGrid products={PRODUCTS} searchable={resolved === '/products'} />
      </div>
    )
  }
  if (resolved.startsWith('/products/group/')) {
    const group = GROUP_BY_SLUG[resolved.slice('/products/group/'.length)]
    if (!group) notFound()
    const products = group.products.map((id) => PRODUCT_BY_SLUG[id]).filter(Boolean)
    return (
      <div className="page catalog-page">
        <p className="eyebrow">CDNER-X / catalog / products / group</p>
        <h1>{group.title}</h1>
        <p className="lede">{group.blurb}</p>
        <ProductGrid products={products} />
        <p style={{ marginTop: 24 }}><Link href="/catalog/hardware">Browse for more</Link></p>
      </div>
    )
  }
  if (resolved.startsWith('/product/')) {
    const product = PRODUCT_BY_SLUG[resolved.slice('/product/'.length)]
    if (!product) notFound()
    const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.groups.some((g) => product.groups.includes(g))).slice(0, 4)
    const upgrade = product.upgradeSku ? PRODUCTS.find((p) => p.sku === product.upgradeSku) : undefined
    return (
      <div className="page catalog-page">
        <p className="eyebrow">
          <Link href="/catalog">Catalog</Link>
          {' / '}
          <Link href={`/catalog/products/group/${product.groups[0]}`}>
            {GROUP_BY_SLUG[product.groups[0]]?.title || product.groups[0]}
          </Link>
        </p>
        <div className="catalog-product">
          <div className="catalog-card-media catalog-product-media" aria-hidden>
            <span>{product.name}</span>
          </div>
          <div>
            <p className="catalog-kicker">
              {product.isNew ? <span className="catalog-new">New</span> : null}
              {product.sku ? <span>{product.sku}</span> : <span>Retail hardware</span>}
            </p>
            <h1>{product.name}</h1>
            <p className="lede">{product.description}</p>
            <p className="catalog-tags">{product.tags.join(' · ')}</p>
            <div className="catalog-price-block">
              {product.monthlyUsd != null && (
                <p><strong><CatalogPrice usd={product.monthlyUsd} suffix="/mo managed" /></strong></p>
              )}
              {product.srpUsd != null && (
                <p><CatalogPrice usd={product.srpUsd} suffix=" suggested retail" /></p>
              )}
              <p className="lede">Location currency is converted from USD. Term 12/24/36 mo (−5/−12/−20%), volume, and 30% upgrade credit apply on CDNER-X subscriptions.</p>
            </div>
            <div className="catalog-card-actions">
              {product.sku ? (
                <Link className="btn" href={`/user?sku=${encodeURIComponent(product.sku)}`}>Subscribe on CDNER-X</Link>
              ) : null}
              <Link className="btn secondary" href="/catalog/buy">Find retailer</Link>
              {upgrade ? (
                <Link className="btn ghost" href={`/catalog/product/${upgrade.slug}`}>Clever upgrade → {upgrade.name}</Link>
              ) : null}
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2>Related machines</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    )
  }

  const article = ARTICLE_BY_PATH[resolved]
  if (!article) notFound()
  return (
    <div className="page catalog-page">
      <p className="eyebrow">CDNER-X / catalog{resolved}</p>
      <h1>{article.title}</h1>
      {article.lede && <p className="lede">{article.lede}</p>}
      {article.paragraphs?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
      {article.sections && (
        <div className="grid-3" style={{ marginTop: 24 }}>
          {article.sections.map((section) => (
            <article className="card" key={section.title}>
              <h3>{section.title}</h3>
              <p className="lede">{section.body}</p>
              {section.href && <Link href={section.href}>Open</Link>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function HomeView() {
  const featured = FEATURED.map((id) => PRODUCT_BY_SLUG[id]).filter(Boolean)
  const highlights = HIGHLIGHTS.map((id) => PRODUCT_BY_SLUG[id]).filter(Boolean)
  return (
    <>
      <div className="hero-band catalog-hero">
        <div className="page">
          <p className="eyebrow">CDNER · Secure connectivity without boundaries</p>
          <h1>Hardware that works harder</h1>
          <p className="lede">
            Routers, switches, wireless, LTE/5G, and compute from the CDNER line — listed here as the public catalogue,
            with CDNER-X subscriptions in your location currency (USD equivalent).
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Link className="btn" href="/catalog/hardware">View all hardware</Link>
            <Link className="btn secondary" href="/user">Estimate a subscription</Link>
            <Link className="btn ghost" href="/catalog/buy">Find a distributor</Link>
          </div>
        </div>
      </div>
      <div className="page catalog-page">
        <div className="catalog-grid catalog-featured">
          {featured.map((product) => (
            <article className="catalog-feature" key={product.slug}>
              <p className="catalog-kicker">{product.isNew ? 'New' : product.tags[0]}</p>
              <h2><Link href={`/catalog/product/${product.slug}`}>{product.name}</Link></h2>
              <p className="lede">{product.description}</p>
              <ul className="catalog-spec-list">
                {product.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <p className="catalog-price-row">
                {product.monthlyUsd != null && <CatalogPrice usd={product.monthlyUsd} suffix="/mo" className="catalog-price" />}
                {product.srpUsd != null && <CatalogPrice usd={product.srpUsd} suffix=" SRP" />}
              </p>
              <div className="catalog-card-actions">
                <Link className="btn ghost" href={`/catalog/product/${product.slug}`}>Details</Link>
                <Link className="btn" href={product.sku ? `/user?sku=${encodeURIComponent(product.sku)}` : '/catalog/buy'}>
                  {product.sku ? 'Subscribe' : 'Find retailer'}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="catalog-section">
          <h2>Enhance your network</h2>
          <p className="lede">Hardware for home offices, enterprises, and carrier-grade ISP infrastructure.</p>
          <div className="catalog-group-grid">
            {GROUPS.filter((g) => g.slug !== 'new').map((group) => (
              <Link className="catalog-group-tile" key={group.slug} href={`/catalog/products/group/${group.slug}`}>
                <strong>{group.title}</strong>
                <span>{group.products.length} {group.products.length === 1 ? 'machine' : 'machines'}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="catalog-section">
          <h2>Know our tech</h2>
          <ProductGrid products={highlights} />
        </section>

        <section className="catalog-section">
          <h2>Software and connectivity</h2>
          <div className="grid-4">
            <article className="card">
              <h3>CDNER OS</h3>
              <p className="lede">Routing, wireless, containers, and Cloud Router.</p>
              <Link href="/catalog/software">Open</Link>
            </article>
            <article className="card">
              <h3>CDNER Desk</h3>
              <p className="lede">Free desktop management for Windows, macOS, and Linux.</p>
              <Link href="/catalog/desk">Open</Link>
            </article>
            <article className="card">
              <h3>CDNER Connect</h3>
              <p className="lede">VPN and file sharing even behind NAT.</p>
              <Link href="/catalog/bth">Open</Link>
            </article>
            <article className="card">
              <h3>eSIM connectivity</h3>
              <p className="lede">Outdoor LTE/5G and IoT without swapping SIMs.</p>
              <Link href="/catalog/connectivity">Open</Link>
            </article>
          </div>
        </section>

        <section className="catalog-section">
          <h2>Training</h2>
          <p className="lede">Certified sessions worldwide. More than 30,000 CDNER certificates issued each year.</p>
          <Link className="btn ghost" href="/catalog/training">Training schedule</Link>
        </section>
      </div>
    </>
  )
}
