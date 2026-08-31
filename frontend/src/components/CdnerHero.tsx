'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FEATURED, PRODUCT_BY_SLUG } from '@/lib/catalog-data'

export default function CdnerHero() {
  const slides = FEATURED.map((id) => PRODUCT_BY_SLUG[id]).filter(Boolean)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length < 2) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  const product = slides[index]
  if (!product) return null

  return (
    <section
      className="cdner-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="cdner-hero-grid">
        <div className="cdner-hero-photo">
          {product.image ? (
            // Product photos only — proxied from the public CDNER catalogue.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} />
          ) : null}
        </div>
        <div className="cdner-hero-copy">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <ul>
            {(product.heroSpecs || product.tags).map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <div className="cdner-hero-actions">
            <Link className="cdner-btn" href={`/catalog/product/${product.slug}`}>Details</Link>
            <Link className="cdner-btn" href="/catalog/buy">Find retailer</Link>
          </div>
        </div>
      </div>
      <div className="cdner-hero-dots" role="tablist" aria-label="Featured machines">
        {slides.map((slide, i) => (
          <button
            key={slide.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? 'is-active' : ''}
            onClick={() => setIndex(i)}
          >
            {slide.name}
          </button>
        ))}
      </div>
    </section>
  )
}
