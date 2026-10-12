'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '../../lib/auth-client'

export default function AuthForm({ mode }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const isSignUp = mode === 'signup'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password })

      if (result.error) {
        setError(result.error.message ?? 'অনুরোধটি সম্পন্ন করা যায়নি।')
        return
      }

      router.replace('/')
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'অনুরোধটি সম্পন্ন করা যায়নি।')
    } finally {
      setIsPending(false)
    }
  }

  async function handleSocialSignIn(provider) {
    setError('')
    setIsPending(true)

    try {
      const result = await authClient.signIn.social({ provider, callbackURL: '/' })
      if (result.error) {
        setError(result.error.message ?? 'সামাজিক মাধ্যমে লগইন করা যায়নি।')
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'সামাজিক মাধ্যমে লগইন করা যায়নি।')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="auth-page min-h-screen">
      <section className="auth-card">
        <Link className="auth-brand" href="/">বাজার দর</Link>
        <h1>{isSignUp ? 'অ্যাকাউন্ট তৈরি করুন' : 'আপনার অ্যাকাউন্টে লগইন করুন'}</h1>
        <p className="auth-intro">বাজারের সর্বশেষ দর দেখতে আপনার অ্যাকাউন্টে প্রবেশ করুন।</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              নাম
              <input autoComplete="name" name="name" required />
            </label>
          )}
          <label>
            ইমেইল
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            পাসওয়ার্ড
            <input
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={8}
              name="password"
              required
              type="password"
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" disabled={isPending} type="submit">
            {isPending ? 'অপেক্ষা করুন…' : isSignUp ? 'রেজিস্টার করুন' : 'লগইন করুন'}
          </button>
        </form>

        <div className="auth-divider"><span>অথবা</span></div>
        <div className="social-buttons">
          <button disabled={isPending} onClick={() => handleSocialSignIn('google')} type="button">
            Google দিয়ে চালিয়ে যান
          </button>
          <button disabled={isPending} onClick={() => handleSocialSignIn('github')} type="button">
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>
        <p className="auth-switch">
          {isSignUp ? 'আগে থেকেই অ্যাকাউন্ট আছে?' : 'অ্যাকাউন্ট নেই?'}{' '}
          <Link href={isSignUp ? '/signin' : '/signup'}>
            {isSignUp ? 'লগইন করুন' : 'রেজিস্টার করুন'}
          </Link>
        </p>
      </section>
    </main>
  )
}
