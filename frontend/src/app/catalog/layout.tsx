import CatalogNav from '@/components/CatalogNav'
import TopNav from '@/components/TopNav'

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <CatalogNav />
      {children}
    </>
  )
}
