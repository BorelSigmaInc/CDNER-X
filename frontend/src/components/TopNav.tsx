'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { readSession, writeSession } from '@/lib/auth'
import type { AuthUser } from '@/lib/api'

export default function TopNav() {
  const [user, setUser] = useState<AuthUser | null>(null)
  useEffect(() => setUser(readSession()), [])

  return (
    <header className="topnav">
      <Link href="/" className="brand-lockup">
        <span className="bars" aria-hidden>
          <span /><span /><span /><span /><span /><span /><span /><span />
        </span>
        CDNER-X
      </Link>
      <nav className="nav-links">
        <Link href="/user">Catalog</Link>
        <Link href="/user">Cost estimator</Link>
        <Link href="/partners">Partners</Link>
        <Link href="/api-doc">Docs</Link>
        <Link href="/console">Lab</Link>
        {user ? (
          <>
            <span className="ghost">{user.email}</span>
            <button className="btn ghost" style={{ padding: '6px 10px' }} onClick={() => { writeSession(null); setUser(null); }}>
              Log out
            </button>
          </>
        ) : (
          <Link href="/sign-in">Log in</Link>
        )}
      </nav>
    </header>
  )
}
