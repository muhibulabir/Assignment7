'use client'

import Link from 'next/link'
import { authClient } from '../../lib/auth-client'

function AccountLinks() {
  return (
    <div className="account-links">
      <Link href="/signin">লগইন</Link>
      <Link className="account-signup" href="/signup">রেজিস্টার</Link>
    </div>
  )
}

function SessionControls() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <span className="account-skeleton" aria-label="অ্যাকাউন্ট লোড হচ্ছে" />
  }

  if (!session) {
    return <AccountLinks />
  }

  return (
    <div className="account-links">
      <span className="account-name">{session.user.name}</span>
      <button
        className="account-signup"
        onClick={() => authClient.signOut()}
        type="button"
      >
        সাইন আউট
      </button>
    </div>
  )
}

export default function AuthControls() {
  if (process.env.NEXT_PUBLIC_AUTH_ENABLED !== 'true') {
    return <AccountLinks />
  }

  return <SessionControls />
}
