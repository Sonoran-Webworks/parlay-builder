import { NextRequest, NextResponse } from 'next/server'
import { fetchLeagueRoster } from '@/lib/espn'
import type { League } from '@/lib/types'

const VALID_LEAGUES: League[] = ['mlb', 'nfl', 'nba', 'nhl']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const league = searchParams.get('league') as League

  if (!league || !VALID_LEAGUES.includes(league)) {
    return NextResponse.json({ error: 'Invalid league' }, { status: 400 })
  }

  const result = await fetchLeagueRoster(league)

  return NextResponse.json(result, {
    headers: {
      // Cache at CDN level for 6 hours
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=43200',
    },
  })
}
