import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'
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
  verification: {
    google: 'jh71vtzM3gp0LnXrP0R3-v9JrMX-KgA7K-UPXqiNKY4',
  },
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
        <GoogleAnalytics gaId="G-YTTG5J8XZR" />
      </body>
    </html>
  )
}
