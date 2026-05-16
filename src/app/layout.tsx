import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import StarField from '@/components/StarField'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'The Parlay Genie – Random Prop Parlay Generator',
  description: 'Generate random sports prop parlays for MLB, NFL, NBA, and NHL. For entertainment purposes only.',
  keywords: ['parlay', 'sports betting', 'prop bets', 'parlay generator', 'MLB', 'NFL', 'NBA', 'NHL'],
  openGraph: {
    title: 'The Parlay Genie',
    description: 'Generate random sports prop parlays. For entertainment only.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StarField fixed />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
