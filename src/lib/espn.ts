import type { League, RosterResponse } from './types'
import { FALLBACK_PLAYER_POOLS } from './propData'

// ESPN sport/league path mapping
const ESPN_CONFIG: Record<League, { sport: string; league: string }> = {
  mlb: { sport: 'baseball', league: 'mlb' },
  nfl: { sport: 'football', league: 'nfl' },
  nba: { sport: 'basketball', league: 'nba' },
  nhl: { sport: 'hockey', league: 'nhl' },
}

// Simple in-memory cache: { league_teamId: { players, timestamp } }
const rosterCache: Record<string, { players: string[]; ts: number }> = {}
const CACHE_TTL_MS = 1000 * 60 * 60 * 6 // 6 hours

async function fetchTeamIds(league: League): Promise<number[]> {
  const { sport, league: lg } = ESPN_CONFIG[league]
  const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${lg}/teams?limit=40`
  const res = await fetch(url, { next: { revalidate: 43200 } }) // Next.js cache 12hr
  if (!res.ok) throw new Error(`ESPN teams fetch failed: ${res.status}`)
  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.sports?.[0]?.leagues?.[0]?.teams ?? []).map((t: any) => Number(t.team.id))
}

async function fetchRosterForTeam(league: League, teamId: number): Promise<string[]> {
  const cacheKey = `${league}_${teamId}`
  const cached = rosterCache[cacheKey]
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.players

  const { sport, league: lg } = ESPN_CONFIG[league]
  const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${lg}/teams/${teamId}/roster`
  const res = await fetch(url, { next: { revalidate: 43200 } })
  if (!res.ok) throw new Error(`ESPN roster fetch failed for team ${teamId}`)
  const data = await res.json()

  const players: string[] = []

  // ESPN roster structure varies by sport
  if (league === 'mlb' || league === 'nhl') {
    // athletes array at top level
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const athletes = data?.athletes ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    athletes.forEach((a: any) => {
      const name = a?.fullName ?? a?.displayName
      if (name) players.push(name)
    })
  } else {
    // NFL and NBA have positional groups
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groups = data?.athletes ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
const NFL_POSITIONS = new Set(['QB','RB','WR','TE','FB','K'])
const NBA_POSITIONS = new Set(['PG','SG','SF','PF','C','G','F'])
const validPos = league === 'nfl' ? NFL_POSITIONS : NBA_POSITIONS
groups.forEach((group: any) => {
  ;(group?.items ?? []).forEach((a: any) => {
    const name = a?.fullName ?? a?.displayName
    const pos = a?.position?.abbreviation ?? ''
    if (name && validPos.has(pos)) players.push(name)
  })
})
  }

  rosterCache[cacheKey] = { players, ts: Date.now() }
  return players
}

export async function fetchLeagueRoster(league: League): Promise<RosterResponse> {
  try {
    const teamIds = await fetchTeamIds(league)

    // Fetch all team rosters in parallel (batched to avoid flooding)
    const BATCH_SIZE = 10
    const allPlayers: string[] = []

    for (let i = 0; i < teamIds.length; i += BATCH_SIZE) {
      const batch = teamIds.slice(i, i + BATCH_SIZE)
      const results = await Promise.allSettled(
        batch.map((id) => fetchRosterForTeam(league, id))
      )
      results.forEach((r) => {
        if (r.status === 'fulfilled') allPlayers.push(...r.value)
      })
    }

    // Dedupe and clean
    const unique = Array.from(new Set(allPlayers)).filter((n) => n && n.length > 2)

    if (unique.length < 20) {
      // Not enough players fetched, fall back
      return { players: FALLBACK_PLAYER_POOLS[league], source: 'fallback' }
    }

    return { players: unique, source: 'espn' }
  } catch (err) {
    console.warn(`ESPN roster fetch failed for ${league}:`, err)
    return { players: FALLBACK_PLAYER_POOLS[league], source: 'fallback' }
  }
}
