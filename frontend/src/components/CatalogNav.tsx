import Link from 'next/link'
import { CATALOG_NAV, GROUPS } from '@/lib/catalog-data'

export default function CatalogNav() {
  return (
    <div className="catalog-subnav">
      <nav className="catalog-subnav-main">
        {CATALOG_NAV.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </nav>
      <nav className="catalog-subnav-groups">
        {GROUPS.map((group) => (
          <Link key={group.slug} href={`/catalog/products/group/${group.slug}`}>{group.title}</Link>
        ))}
      </nav>
    </div>
  )
}
