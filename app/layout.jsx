import './globals.css'
import './auth.css'

export const metadata = {
  title: 'বাজার দর',
  description: 'আজকের বাজারের দাম এক নজরে দেখুন।',
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  )
}
