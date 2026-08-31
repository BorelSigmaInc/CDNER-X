import Link from 'next/link'

export default function CatalogNotFound() {
  return (
    <div className="page catalog-page">
      <p className="eyebrow">CDNER-X / catalog</p>
      <h1>Page not in this catalogue</h1>
      <p className="lede">That path is not part of the CDNER hardware or support tree.</p>
      <Link className="btn" href="/catalog">Back to catalog</Link>
    </div>
  )
}
