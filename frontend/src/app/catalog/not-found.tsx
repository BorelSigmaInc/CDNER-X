import Link from 'next/link'

export default function CatalogNotFound() {
  return (
    <div className="cdner-wrap">
      <h1>Page not in this catalogue</h1>
      <p className="cdner-lede">That path is not part of the CDNER hardware or support tree.</p>
      <Link className="cdner-btn cdner-btn-light" href="/catalog">Back to catalog</Link>
    </div>
  )
}
