import Link from 'next/link'
import type { CatalogProduct } from '@/lib/catalog-data'
import { productPhoto } from '@/lib/catalog-data'
import CatalogPrice from './CatalogPrice'

export default function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="cdner-product-card">
      <Link href={`/catalog/product/${product.slug}`} className="cdner-product-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={productPhoto(product)} alt={product.name} />
      </Link>
      <div className="cdner-product-body">
        {product.isNew ? <span className="cdner-new">New</span> : null}
        <h3><Link href={`/catalog/product/${product.slug}`}>{product.name}</Link></h3>
        <p>{product.description}</p>
        <p className="cdner-product-price">
          {product.srpUsd != null && <CatalogPrice usd={product.srpUsd} suffix="*" />}
          {product.monthlyUsd != null && (
            <>
              {' '}
              <CatalogPrice usd={product.monthlyUsd} suffix="/mo" />
            </>
          )}
        </p>
        <div className="cdner-hero-actions">
          <Link className="cdner-btn cdner-btn-light" href={`/catalog/product/${product.slug}`}>Details</Link>
          {product.sku ? (
            <Link className="cdner-btn cdner-btn-light" href={`/user?sku=${encodeURIComponent(product.sku)}`}>Subscribe</Link>
          ) : (
            <Link className="cdner-btn cdner-btn-light" href="/catalog/buy">Find retailer</Link>
          )}
        </div>
      </div>
    </article>
  )
}
