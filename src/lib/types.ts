export type League = 'mlb' | 'nfl' | 'nba' | 'nhl'
export type OddsFormat = 'american' | 'decimal'

export interface OddsTier {
  label: string
  odds: number[]
}

export interface PropType {
  tiers: OddsTier[]
}

export interface LeagueData {
  icon: string
  emoji: string
  players: string[]
  props: Record<string, PropType>
}

export interface ParlayLeg {
  player: string
  label: string
  oddsRaw: number
  league: League
  emoji: string
}

export interface RosterResponse {
  players: string[]
  source: 'espn' | 'fallback'
}
