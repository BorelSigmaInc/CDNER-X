'use client'

import { useMemo, useState } from 'react'
import type { CatalogProduct } from '@/lib/catalog-data'
import ProductCard from './ProductCard'

export default function ProductGrid({
  products,
  searchable = false,
}: {
  products: CatalogProduct[]
  searchable?: boolean
}) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return products
    return products.filter((p) =>
      [p.name, p.description, p.sku, ...p.tags, ...p.groups].join(' ').toLowerCase().includes(needle),
    )
  }, [products, q])

  return (
    <>
      {searchable && (
        <div className="field" style={{ maxWidth: 420, marginBottom: 20 }}>
          <label htmlFor="catalog-search">Search machines</label>
          <input
            id="catalog-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Air, Core, 5G, Wi-Fi 7…"
          />
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="lede">No products in this group yet. Browse the full catalogue.</p>
      ) : (
        <div className="catalog-grid">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
