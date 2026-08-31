import CdnerFooter from '@/components/CdnerFooter'
import CdnerHeader from '@/components/CdnerHeader'
import './catalog.css'

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cdner-site">
      <CdnerHeader />
      {children}
      <CdnerFooter />
    </div>
  )
}
