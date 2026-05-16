'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  baseOpacity: number
  twinkleSpeed: number
  phase: number
  color: string
}

interface DustParticle {
  x: number
  y: number
  r: number
  opacity: number
  hue: number
}

export default function StarField({ className, fixed }: { className?: string; fixed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: Star[] = []
    let dust: DustParticle[] = []
    let w = 0
    let h = 0

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx!.scale(dpr, dpr)
      initParticles()
    }

    function initParticles() {
      const STAR_COLORS = ['255,255,255', '200,215,255', '255,220,200', '190,170,255']
      const count = Math.floor((w * h) / 3200)

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        baseOpacity: Math.random() * 0.65 + 0.18,
        twinkleSpeed: Math.random() * 0.9 + 0.3,
        phase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }))

      dust = Array.from({ length: 22 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.8 + 1.0,
        opacity: Math.random() * 0.28 + 0.08,
        hue: Math.random() > 0.55 ? 268 : 190,
      }))
    }

    function draw(t: number) {
      if (!ctx) return

      // Background gradient: near-black → deep purple
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#050508')
      bg.addColorStop(0.42, '#0a0520')
      bg.addColorStop(0.76, '#14073a')
      bg.addColorStop(1, '#1e0848')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Soft nebula glow blooming from lower-center
      const nebula = ctx.createRadialGradient(w * 0.5, h * 1.05, 0, w * 0.5, h * 0.8, w * 0.65)
      nebula.addColorStop(0, 'rgba(110, 30, 230, 0.2)')
      nebula.addColorStop(0.5, 'rgba(80, 15, 160, 0.09)')
      nebula.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, w, h)

      // Stardust particles — soft glowing blobs
      for (const d of dust) {
        const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 5)
        grd.addColorStop(0, `hsla(${d.hue}, 75%, 72%, ${d.opacity})`)
        grd.addColorStop(0.5, `hsla(${d.hue}, 60%, 55%, ${d.opacity * 0.4})`)
        grd.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r * 5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      }

      // Stars with twinkle
      for (const s of stars) {
        const twinkle = (Math.sin(t * s.twinkleSpeed * 0.001 + s.phase) + 1) * 0.5
        const opacity = s.baseOpacity * (0.38 + twinkle * 0.62)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color}, ${opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        ...(fixed
          ? { position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1 }
          : {}),
      }}
      aria-hidden
    />
  )
}
