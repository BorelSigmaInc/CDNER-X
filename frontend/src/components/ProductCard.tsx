import Link from 'next/link'
import type { CatalogProduct } from '@/lib/catalog-data'
import CatalogPrice from './CatalogPrice'

export default function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="catalog-card">
      <div className="catalog-card-media" aria-hidden>
        <span>{product.name.split(' ').slice(0, 2).join(' ')}</span>
      </div>
      <div className="catalog-card-body">
        <p className="catalog-kicker">
          {product.isNew ? <span className="catalog-new">New</span> : null}
          {product.sku ? <span>Subscription</span> : <span>Hardware</span>}
        </p>
        <h3><Link href={`/catalog/product/${product.slug}`}>{product.name}</Link></h3>
        <p className="lede">{product.description}</p>
        <p className="catalog-tags">{product.tags.join(' · ')}</p>
        <p className="catalog-price-row">
          {product.monthlyUsd != null && (
            <CatalogPrice usd={product.monthlyUsd} suffix="/mo" className="catalog-price" />
          )}
          {product.srpUsd != null && (
            <CatalogPrice usd={product.srpUsd} suffix=" SRP" />
          )}
          {product.monthlyUsd == null && product.srpUsd == null && <span>Ask a distributor</span>}
        </p>
        <div className="catalog-card-actions">
          <Link className="btn ghost" href={`/catalog/product/${product.slug}`}>Details</Link>
          {product.sku ? (
            <Link className="btn" href={`/user?sku=${encodeURIComponent(product.sku)}`}>Subscribe</Link>
          ) : (
            <Link className="btn secondary" href="/catalog/buy">Find retailer</Link>
          )}
        </div>
      </div>
    </article>
  )
}
