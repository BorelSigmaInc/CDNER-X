'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { writeSession } from '@/lib/auth'

export default function SignInPage() {
  const router = useRouter()
  const next = '/user'
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState<'id' | 'password'>('id')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState<'customer' | 'partner'>('customer')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const continueId = (event: FormEvent) => {
    event.preventDefault()
    if (!email.includes('@')) {
      setError('Enter a valid CDNER-X ID (email).')
      return
    }
    setError('')
    setStep('password')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const action = mode === 'login'
      ? api.login(email, password)
      : api.register(email, password, role, company || undefined)
    action
      .then((data) => {
        writeSession({
          user_id: data.user_id,
          email: data.email,
          role: data.role,
          partner_id: data.partner_id,
        })
        if (remember) localStorage.setItem('cdnerx.id', email)
        const dest = data.role === 'partner' ? '/partners' : next
        router.push(dest)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="signin-shell">
      <header className="topnav">
        <Link href="/" className="brand-lockup">
          <span className="bars" aria-hidden><span /><span /><span /><span /><span /><span /><span /><span /></span>
          CDNER-X
        </Link>
      </header>
      <main className="signin-card">
        <h1>{mode === 'login' ? 'Log in to CDNER-X' : 'Create a CDNER-X ID'}</h1>
        {mode === 'login' ? (
          <p>Don’t have an account? <button className="btn ghost" type="button" onClick={() => { setMode('register'); setStep('id') }}>Create a CDNER-X ID</button></p>
        ) : (
          <p>Already registered? <button className="btn ghost" type="button" onClick={() => setMode('login')}>Log in</button></p>
        )}
        {error && <div className="banner error">{error}</div>}

        {step === 'id' && (
          <form onSubmit={continueId}>
            <div className="field">
              <label htmlFor="id">CDNER-X ID</label>
              <input id="id" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {mode === 'register' && (
              <>
                <div className="field">
                  <label htmlFor="role">Account type</label>
                  <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'customer' | 'partner')}>
                    <option value="customer">Customer / user</option>
                    <option value="partner">Partner / vendor</option>
                  </select>
                </div>
                {role === 'partner' && (
                  <div className="field">
                    <label htmlFor="company">Company</label>
                    <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Vendor legal name" />
                  </div>
                )}
              </>
            )}
            <button className="btn" type="submit">Continue</button>
            <label className="check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember ID
            </label>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={submit}>
            <p className="lede">{email} <button type="button" className="btn ghost" onClick={() => setStep('id')}>Not you?</button></p>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create ID'}</button>
          </form>
        )}

        <div className="alt">
          Forgot CDNER-X ID? Contact Borel Sigma operations.
          <p>Demo partner: <code>vendor.access@cdner.test</code> / <code>ChangeMe#31</code> (CDNER Access).</p>
        </div>
      </main>
    </div>
  )
}
