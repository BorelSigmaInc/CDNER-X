'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Fx = { currency: string; usd_rate: number; symbol: string }

let cached: Fx | null = null
let pending: Promise<Fx> | null = null

function loadFx() {
  if (cached) return Promise.resolve(cached)
  if (!pending) {
    pending = api.fx().then((data) => {
      cached = data
      return data
    }).finally(() => { pending = null })
  }
  return pending
}

export default function CatalogPrice({
  usd,
  suffix = '',
  className,
}: {
  usd: number
  suffix?: string
  className?: string
}) {
  const [fx, setFx] = useState<Fx | null>(cached)

  useEffect(() => {
    loadFx().then(setFx).catch(() => setFx({ currency: 'USD', usd_rate: 1, symbol: '$' }))
  }, [])

  const usdLabel = `USD ${usd.toLocaleString(undefined, { minimumFractionDigits: usd % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
  if (!fx || fx.currency === 'USD' || fx.usd_rate === 1) {
    return <span className={className}>{usdLabel}{suffix}</span>
  }
  const local = usd * fx.usd_rate
  const localLabel = `${fx.symbol}${local.toLocaleString(undefined, { maximumFractionDigits: local >= 100 ? 0 : 2 })}`
  return (
    <span className={className}>
      {localLabel}{suffix}
      <span className="catalog-usd"> · {usdLabel}</span>
    </span>
  )
}
