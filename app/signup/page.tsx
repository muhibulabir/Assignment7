import AuthForm from '../components/auth-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'রেজিস্টার | বাজার দর',
}

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}
