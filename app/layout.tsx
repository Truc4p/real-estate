import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/layout/Navbar'
import ComparisonBar from '@/components/properties/ComparisonBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HomeFinder Pro - Your Smart Real Estate Search Companion',
  description: 'Discover your dream property with HomeFinder Pro. Advanced search, interactive maps, real-time alerts, price history charts, neighborhood insights, and financial calculators.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ComparisonBar />
        </Providers>
      </body>
    </html>
  )
}
