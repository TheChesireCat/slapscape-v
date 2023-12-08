import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Slapscape',
  description: 'A Project by Ibrahim and Ankit',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/sticker.svg" />
      </head>
      <body >
        {children}
      </body>
    </html>
  )
}
