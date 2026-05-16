'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
/**
 * First match wins. Your full hero art: `public/assets/genie/Untitled.PNG`, then JPG fallbacks.
 */
const HERO_POSTER_SOURCES = [
  '/assets/genie/Untitled.PNG',
  '/assets/genie/Untitled.png',
  '/genie-logo.jpg',
  '/genie-hero.jpg',
  '/genie-cash.jpg',
] as const

function useFirstAvailableSrc(sources: readonly string[]) {
  const [i, setI] = useState(0)
  const src = i < sources.length ? sources[i] : null
  const onError = () => setI((x) => Math.min(x + 1, sources.length))
  return { src, onError }
}

function HeroPoster({ sources, alt }: { sources: readonly string[]; alt: string }) {
  const { src, onError } = useFirstAvailableSrc(sources)

  if (!src) {
    return (
      <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-2 px-4 text-center text-xs text-zinc-500">
        <p>Could not load hero art.</p>
        <p className="max-w-[18rem] text-[11px] leading-relaxed text-zinc-600">
          Add <span className="font-mono text-cyan-700">public/genie-logo.jpg</span> or{' '}
          <span className="font-mono text-cyan-700">public/assets/genie/poster.png</span>, then refresh.
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-0 w-full">
      {/* object-contain: full art visible inside frame; black bg fills letterboxing. Use 4:5 source + object-cover if you want zero bars. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static /public hero poster */}
      <img
        key={src}
        src={src}
        alt={alt}
        width={689}
        height={930}
        className="absolute inset-0 h-full w-full object-contain object-center select-none"
        style={{ mixBlendMode: 'screen' }}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
        onError={onError}
      />
    </div>
  )
}

/** Static full poster, centered inside the neon outline — no smoke, arcs, or motion. */
function GenieHeroPoster() {
  return (
    <div className="relative flex w-full flex-1 justify-center lg:justify-end lg:pr-2">
      <div className="relative w-full max-w-[min(560px,94vw)] lg:max-w-[min(580px,48vw)]">
        <div className="relative mx-auto aspect-[689/930] w-full max-h-[min(44vw,220px)] min-h-[160px] sm:min-h-[min(48vh,400px)] sm:max-h-[min(74vh,640px)] md:min-h-[min(56vh,500px)] md:max-h-[min(82vh,760px)]">
          <div
            className="absolute inset-0 z-10"
            style={{
              maskImage:
                'radial-gradient(ellipse 88% 84% at 50% 46%, black 55%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0.15) 86%, transparent 96%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 88% 84% at 50% 46%, black 55%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0.15) 86%, transparent 96%)',
            }}
          >
            <HeroPoster sources={HERO_POSTER_SOURCES} alt="Parlay Genie" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GenieHero() {
  const reduce = useReducedMotion()

  return (
    <section
      className="relative min-h-0 overflow-hidden text-zinc-100 max-sm:pb-4 sm:min-h-[min(100svh,920px)]"
      aria-labelledby="genie-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-hero-radial opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] animate-grid-pan"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px, 48px 48px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#030306] via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-6 pt-6 max-sm:gap-4 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="max-w-xl lg:pb-8">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">
            Parlay Genie
          </p>
          <motion.h1
            id="genie-hero-heading"
            className={`font-display text-4xl leading-[0.95] tracking-[0.06em] text-white min-[480px]:text-5xl sm:text-6xl md:text-7xl ${reduce ? '' : 'animate-flicker'}`}
            style={{
              textShadow:
                '0 0 20px rgba(34,211,238,0.5), 0 0 48px rgba(168,85,247,0.35), 0 0 4px rgba(255,255,255,0.8)',
            }}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Your wish
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              is a better slip
            </span>
          </motion.h1>
          <motion.div
            className="mt-5 flex flex-wrap gap-3 sm:mt-8"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
          >
            <a
              href="#generator"
              className="inline-flex items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-500/15 px-6 py-3 font-sans text-sm font-semibold text-cyan-100 shadow-neon-sm transition hover:border-cyan-300 hover:bg-cyan-400/25 hover:shadow-neon"
            >
              Build a parlay
            </a>
          </motion.div>
        </div>

        <GenieHeroPoster />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        aria-hidden
      />
    </section>
  )
}
