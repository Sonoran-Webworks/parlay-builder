import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parlay Builder – Random Prop Parlay Generator',
  description: 'Generate random sports prop parlays for MLB, NFL, NBA, and NHL. For entertainment purposes only.',
  keywords: ['parlay', 'sports betting', 'prop bets', 'parlay generator', 'MLB', 'NFL', 'NBA', 'NHL'],
  openGraph: {
    title: 'Parlay Builder',
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
      <head>
        {/*
          GOOGLE ADSENSE — uncomment and replace ca-pub-XXXXXXXXXXXXXXXX
          with your publisher ID once your AdSense account is approved.

          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
          />
        */}
      </head>
      <body>{children}</body>
    </html>
  )
}
