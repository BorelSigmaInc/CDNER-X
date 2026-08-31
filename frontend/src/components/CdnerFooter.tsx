import Link from 'next/link'
import { CATALOG_MENUS } from '@/lib/catalog-data'

export default function CdnerFooter() {
  return (
    <footer className="cdner-footer">
      <div className="cdner-footer-grid">
        {CATALOG_MENUS.map((menu) => (
          <div key={menu.label}>
            <Link href={menu.href} className="cdner-footer-title">{menu.label}</Link>
            {menu.groups.map((item) => (
              <Link key={item.href + item.label} href={item.href}>{item.label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="cdner-footer-bar">
        <span>CDNER</span>
        <Link href="/catalog/notifications">Subscribe to our newsletter</Link>
        <Link href="/catalog/privacy">Privacy Policy</Link>
        <Link href="/">CDNER-X cloud</Link>
      </div>
    </footer>
  )
}
