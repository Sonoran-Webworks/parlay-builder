'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string        // AdSense ad-slot ID e.g. "1234567890"
  format?: string     // e.g. "auto", "rectangle"
  style?: React.CSSProperties
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

/**
 * Drop-in Google AdSense component.
 * Replace YOUR_AD_SLOT with the slot ID from your AdSense dashboard.
 * The ad won't render until you:
 *   1. Add your AdSense script to layout.tsx (see the comment there)
 *   2. Replace PUBLISHER_ID in layout.tsx
 *   3. Set enabled=true below or via env var
 */
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true'

export default function AdSlot({ slot, format = 'auto', style }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!ADS_ENABLED || pushed.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
    } catch (e) {
      console.warn('AdSense push failed:', e)
    }
  }, [])

  if (!ADS_ENABLED) {
    // Show placeholder in dev / before ads are enabled
    return (
      <div style={{
        width: '100%',
        minHeight: 90,
        background: 'var(--color-bg-secondary)',
        border: '1px dashed var(--color-border)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-tertiary)',
        fontSize: 12,
        margin: '16px 0',
        ...style,
      }}>
        Ad slot — enable in .env.local (NEXT_PUBLIC_ADS_ENABLED=true)
      </div>
    )
  }

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
