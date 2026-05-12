import type { League, ParlayLeg, OddsTier } from './types'
import { LEAGUE_DATA } from './propData'

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function jitter(v: number, pct = 0.1): number {
  return Math.round(v * (1 + (Math.random() - 0.5) * pct))
}

export function toDecimal(american: number): number {
  return american > 0 ? 1 + american / 100 : 1 + 100 / Math.abs(american)
}

export function formatAmerican(american: number): string {
  return american > 0 ? `+${american}` : `${american}`
}

export function formatOdds(american: number, format: 'american' | 'decimal'): string {
  if (format === 'decimal') return toDecimal(american).toFixed(2)
  return formatAmerican(american)
}

export function oddsClass(american: number): 'pos' | 'neg' | 'neu' {
  if (american > 0) return 'pos'
  if (american < -110) return 'neg'
  return 'neu'
}

export function calcParlayAmerican(legs: ParlayLeg[]): number {
  const mult = legs.reduce((acc, leg) => acc * toDecimal(leg.oddsRaw), 1)
  return mult >= 2
    ? Math.round((mult - 1) * 100)
    : Math.round(-100 / (mult - 1))
}

interface GenerateParams {
  league: League
  propKey: string
  numLegs: number
  players: string[]
  legMin: number
  legMax: number // Infinity = unlimited
  parlayMin: number
  parlayMax: number // Infinity = unlimited
}

export function generateParlay(params: GenerateParams): ParlayLeg[] | null {
  const { league, propKey, numLegs, players, legMin, legMax, parlayMin, parlayMax } = params
  const leagueData = LEAGUE_DATA[league]
  const propData = leagueData.props[propKey]
  if (!propData) return null

  // Filter tiers that can produce at least one odds value in range
  const eligibleTiers: OddsTier[] = propData.tiers.filter((t) =>
    t.odds.some((o) => {
      const j = jitter(o)
      return j >= legMin && j <= legMax
    })
  )
  if (eligibleTiers.length === 0) return null

  const MAX_ATTEMPTS = 500
  for (let att = 0; att < MAX_ATTEMPTS; att++) {
    const used = new Set<string>()
    const legs: ParlayLeg[] = []
    let valid = true

    for (let i = 0; i < numLegs; i++) {
      let player = ''
      let tries = 0
      do {
        player = pick(players)
        tries++
      } while (used.has(player) && tries < 50)
      used.add(player)

      const tier = pick(eligibleTiers)
      const raw = jitter(pick(tier.odds))

      if (raw < legMin || raw > legMax) {
        valid = false
        break
      }

      legs.push({
        player,
        label: tier.label,
        oddsRaw: raw,
        league,
        emoji: leagueData.emoji,
      })
    }

    if (!valid || legs.length !== numLegs) continue

    const parlayAm = calcParlayAmerican(legs)
    if (parlayAm >= parlayMin && parlayAm <= parlayMax) {
      return legs
    }
  }

  return null
}
