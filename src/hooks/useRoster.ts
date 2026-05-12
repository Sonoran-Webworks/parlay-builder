'use client'

import { useState, useEffect, useRef } from 'react'
import type { League } from '@/lib/types'
import { FALLBACK_PLAYER_POOLS } from '@/lib/propData'

// Client-side cache so we don't re-fetch on every league switch
const clientCache: Partial<Record<League, { players: string[]; ts: number }>> = {}
const CACHE_TTL = 1000 * 60 * 60 * 6 // 6 hours

export function useRoster(league: League) {
  const [players, setPlayers] = useState<string[]>(FALLBACK_PLAYER_POOLS[league])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<'espn' | 'fallback'>('fallback')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Check client cache first
    const cached = clientCache[league]
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setPlayers(cached.players)
      setSource('espn')
      return
    }

    // Abort any in-flight request for previous league
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    // Start with fallback immediately so UI isn't blocked
    setPlayers(FALLBACK_PLAYER_POOLS[league])

    fetch(`/api/roster?league=${league}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data?.players?.length > 0) {
          clientCache[league] = { players: data.players, ts: Date.now() }
          setPlayers(data.players)
          setSource(data.source ?? 'espn')
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Roster fetch error:', err)
          setSource('fallback')
        }
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [league])

  return { players, loading, source }
}
