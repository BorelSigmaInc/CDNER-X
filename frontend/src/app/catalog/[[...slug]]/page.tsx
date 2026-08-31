import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProductGrid from '@/components/ProductGrid'
import CatalogPrice from '@/components/CatalogPrice'
import CdnerHero from '@/components/CdnerHero'
import {
  ALIASES,
  ARTICLE_BY_PATH,
  GROUP_BY_SLUG,
  HIGHLIGHTS,
  HOME_GROUPS,
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
    return { title: 'CDNER · Secure Connectivity Without Boundaries', description: 'CDNER hardware, software, and training.' }
  }
  if (path.startsWith('/product/')) {
    const product = PRODUCT_BY_SLUG[path.slice('/product/'.length)]
    if (product) return { title: `CDNER · ${product.name}`, description: product.description }
  }
  if (path.startsWith('/products/group/')) {
    const group = GROUP_BY_SLUG[path.slice('/products/group/'.length)]
    if (group) return { title: group.title, description: group.blurb }
  }
  const article = ARTICLE_BY_PATH[path]
  if (article) return { title: `CDNER · ${article.title}`, description: article.lede }
  return { title: 'CDNER' }
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
      <div className="cdner-wrap">
        <p className="cdner-kicker">{article?.title}</p>
        <h1>{article?.title || 'Products'}</h1>
        <p className="cdner-lede">{article?.lede}</p>
        <ProductGrid products={PRODUCTS} searchable={resolved === '/products'} />
      </div>
    )
  }
  if (resolved.startsWith('/products/group/')) {
    const group = GROUP_BY_SLUG[resolved.slice('/products/group/'.length)]
    if (!group) notFound()
    const products = group.products.map((id) => PRODUCT_BY_SLUG[id]).filter(Boolean)
    return (
      <div className="cdner-wrap">
        <p className="cdner-crumb"><Link href="/catalog/hardware">Hardware</Link> / {group.title}</p>
        <h1>{group.title}</h1>
        <p className="cdner-lede">{group.blurb}</p>
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
      <div className="cdner-wrap">
        <p className="cdner-crumb">
          <Link href="/catalog">CDNER</Link>
          {' / '}
          <Link href={`/catalog/products/group/${product.groups[0]}`}>
            {GROUP_BY_SLUG[product.groups[0]]?.title || product.groups[0]}
          </Link>
        </p>
        <div className="cdner-product-page">
          <div className="cdner-product-stage">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} />
            ) : (
              <span>{product.name}</span>
            )}
          </div>
          <div>
            {product.isNew ? <p className="cdner-new">New</p> : null}
            <h1>{product.name}</h1>
            <p className="cdner-lede">{product.description}</p>
            <ul>
              {(product.heroSpecs || product.tags).map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
            <p className="cdner-product-price">
              {product.srpUsd != null && <CatalogPrice usd={product.srpUsd} suffix=" suggested retail*" />}
            </p>
            {product.monthlyUsd != null && (
              <p className="cdner-product-price"><CatalogPrice usd={product.monthlyUsd} suffix="/mo managed" /></p>
            )}
            <p className="cdner-lede">* Suggested retail price. Contact an official distributor for availability and local pricing.</p>
            <div className="cdner-hero-actions">
              {product.sku ? (
                <Link className="cdner-btn cdner-btn-light" href={`/user?sku=${encodeURIComponent(product.sku)}`}>Subscribe</Link>
              ) : null}
              <Link className="cdner-btn cdner-btn-light" href="/catalog/buy">Find retailer</Link>
              {upgrade ? (
                <Link className="cdner-btn cdner-btn-light" href={`/catalog/product/${upgrade.slug}`}>Upgrade → {upgrade.name}</Link>
              ) : null}
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2>Browse for more</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    )
  }

  const article = ARTICLE_BY_PATH[resolved]
  if (!article) notFound()
  return (
    <div className="cdner-wrap cdner-article">
      <h1>{article.title}</h1>
      {article.lede && <p className="cdner-lede">{article.lede}</p>}
      {article.paragraphs?.map((p) => <p key={p.slice(0, 48)}>{p}</p>)}
      {article.sections && (
        <div className="cdner-soft" style={{ marginTop: 24 }}>
          {article.sections.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              {section.href && <Link href={section.href}>Open</Link>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function HomeView() {
  const highlights = HIGHLIGHTS.map((id) => PRODUCT_BY_SLUG[id]).filter(Boolean)
  const homeGroups = HOME_GROUPS.map((slug) => GROUP_BY_SLUG[slug]).filter(Boolean)
  return (
    <>
      <CdnerHero />
      <section className="cdner-band">
        <div className="cdner-wrap" style={{ paddingBottom: 24 }}>
          <p className="cdner-kicker">Hardware</p>
          <h2>Enhance Your Network</h2>
          <p className="cdner-lede">With Hardware That Works Harder</p>
          <p className="cdner-lede">
            CDNER offers routers, switches, and wireless systems for every type of network – from home offices and small
            businesses to carrier-grade ISP infrastructure. Whether you&apos;re building a setup for a few users or thousands,
            there&apos;s a CDNER device that fits your needs and your budget.
          </p>
          <div className="cdner-cats">
            {homeGroups.map((group) => (
              <Link className="cdner-cat" key={group.slug} href={`/catalog/products/group/${group.slug}`}>
                <strong>{group.title}</strong>
                <span>Go to products list</span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 16 }}><Link href="/catalog/hardware">View All</Link></p>
        </div>
      </section>
      <div className="cdner-wrap">
        <p className="cdner-kicker">Video Blog</p>
        <h2>Know our tech</h2>
        <ProductGrid products={highlights} />
        <section style={{ marginTop: 56 }}>
          <h2>Software and connectivity</h2>
          <div className="cdner-soft">
            <Link href="/catalog/connectivity">
              <h3>Connectivity</h3>
              <p>Seamless networking with latest eSIM-enabled devices designed for IoT, enterprise, and mobile networking.</p>
            </Link>
            <Link href="/catalog/bth">
              <h3>CDNER Connect App</h3>
              <p>Free secure VPN access anywhere — unleash the power of your router.</p>
            </Link>
            <Link href="/catalog/desk">
              <h3>CDNER Desk</h3>
              <p>Our Pro desktop app with endless configuration possibilities is available for all operating systems.</p>
            </Link>
            <Link href="/catalog/mobile_app">
              <h3>Home App</h3>
              <p>Simple and easy way to manage your home router. For Android and iOS.</p>
            </Link>
          </div>
        </section>
        <section style={{ marginTop: 56 }}>
          <p className="cdner-kicker">CDNER Certified</p>
          <h2>Training Program</h2>
          <p className="cdner-lede">
            CDNER training sessions are organized and provided by CDNER Training Centers at various locations around the
            World. They are attended by network engineers, integrators and managers, who would like to learn about routing
            and managing wired and wireless networks using CDNER OS.
          </p>
          <div className="cdner-hero-actions" style={{ marginTop: 16 }}>
            <Link className="cdner-btn cdner-btn-light" href="/catalog/training">Training Schedule</Link>
            <Link className="cdner-btn cdner-btn-light" href="/catalog/training/centers">Locate Trainer</Link>
          </div>
        </section>
      </div>
    </>
  )
}
