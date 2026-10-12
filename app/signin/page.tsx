import AuthForm from '../components/auth-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'লগইন | বাজার দর',
}

export default function SignInPage() {
  return <AuthForm mode="signin" />
}
