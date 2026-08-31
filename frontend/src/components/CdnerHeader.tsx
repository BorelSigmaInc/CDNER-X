'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CATALOG_MENUS } from '@/lib/catalog-data'

export default function CdnerHeader({ inverted = false }: { inverted?: boolean }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <header className={`cdner-header${inverted ? ' is-invert' : ''}`}>
      <div className="cdner-header-bar">
        <Link href="/catalog" className="cdner-wordmark">CDNER</Link>
        <nav className="cdner-menu">
          {CATALOG_MENUS.map((menu) => (
            <div
              key={menu.label}
              className={`cdner-menu-item${open === menu.label ? ' is-open' : ''}`}
              onMouseEnter={() => setOpen(menu.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link href={menu.href}>{menu.label}</Link>
              <div className="cdner-mega">
                {menu.groups.map((item) => (
                  <Link key={item.href + item.label} href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="cdner-header-tools">
          <Link href="/catalog/products">Search</Link>
          <Link href="/">CDNER-X</Link>
          <Link href="/sign-in">Log in</Link>
        </div>
      </div>
    </header>
  )
}
