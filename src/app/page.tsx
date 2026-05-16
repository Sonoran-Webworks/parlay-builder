'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { League, OddsFormat, ParlayLeg } from '@/lib/types'
import { LEAGUE_DATA } from '@/lib/propData'
import { generateParlay, formatOdds, formatAmerican, oddsClass, calcParlayAmerican, toDecimal } from '@/lib/parlayEngine'
import { useRoster } from '@/hooks/useRoster'
import AdSlot from '@/components/AdSlot'
import styles from './page.module.css'

const LEAGUES: League[] = ['mlb', 'nfl', 'nba', 'nhl']

export default function Home() {
  const [league, setLeague] = useState<League>('mlb')
  const [propKey, setPropKey] = useState<string>('Home run')
  const [numLegs, setNumLegs] = useState(3)
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>('american')
  const [legMin, setLegMin] = useState(-500)
  const [legMax, setLegMax] = useState(5000)
  const [legUnlimited, setLegUnlimited] = useState(false)
  const [parlayMin, setParlayMin] = useState(-200)
  const [parlayMax, setParlayMax] = useState(150000)
  const [parlayUnlimited, setParlayUnlimited] = useState(false)
  const [wager, setWager] = useState(20)
  const [legs, setLegs] = useState<ParlayLeg[] | null>(null)
  const [parlayAm, setParlayAm] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { players, loading: rosterLoading, source: rosterSource } = useRoster(league)

  function handleLeagueChange(l: League) {
    setLeague(l)
    // Reset prop to first available for new league
    const firstProp = Object.keys(LEAGUE_DATA[l].props)[0]
    setPropKey(firstProp)
    setLegs(null)
    setError(null)
  }

  const handleGenerate = useCallback(() => {
    setError(null)
    const result = generateParlay({
      league,
      propKey,
      numLegs,
      players,
      legMin,
      legMax: legUnlimited ? Infinity : legMax,
      parlayMin,
      parlayMax: parlayUnlimited ? Infinity : parlayMax,
    })
    if (!result) {
      setError('No parlay found matching your filters — try widening the odds range.')
      setLegs(null)
      return
    }
    setLegs(result)
    setParlayAm(calcParlayAmerican(result))
  }, [league, propKey, numLegs, players, legMin, legMax, legUnlimited, parlayMin, parlayMax, parlayUnlimited])

  const toWin = legs ? ((toDecimal(parlayAm) - 1) * wager).toFixed(2) : '0.00'
  const totalReturn = legs ? (toDecimal(parlayAm) * wager).toFixed(2) : '0.00'

  function handleCopy() {
    if (!legs) return
    const text = legs.map((l, i) =>
      `Leg ${i + 1}: ${l.player} — ${l.label} (${formatOdds(l.oddsRaw, oddsFormat)})`
    ).join('\n') + `\nParlay odds: ${formatAmerican(parlayAm)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const propKeys = Object.keys(LEAGUE_DATA[league].props)
  const tiers = LEAGUE_DATA[league].props[propKey]?.tiers ?? []

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Parlay Builder</h1>
            <p className={styles.sub}>Random prop parlay generator</p>
          </div>
          <span className={styles.badge}>For entertainment</span>
        </div>

        {/* Top ad */}
        <AdSlot slot="TOP_AD_SLOT_ID" />

        {/* Step 1 — League */}
        <div className={styles.card}>
          <div className={styles.stepLabel}>1 — Pick a league</div>
          <div className={styles.leagueGrid}>
            {LEAGUES.map((l) => (
              <button
                key={l}
                className={`${styles.leagueBtn} ${league === l ? styles.active : ''}`}
                onClick={() => handleLeagueChange(l)}
              >
                <span className={styles.leagueEmoji}>{LEAGUE_DATA[l].emoji}</span>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {rosterLoading && (
            <p className={styles.rosterStatus}>Fetching live rosters from ESPN…</p>
          )}
          {!rosterLoading && rosterSource === 'espn' && (
            <p className={styles.rosterStatus}>✓ Live roster — {players.length} players</p>
          )}
        </div>

        {/* Step 2 & 3 — Prop + Legs */}
        <div className={styles.row2}>
          <div className={styles.card}>
            <div className={styles.stepLabel}>2 — Prop type</div>
            <select
              className={styles.select}
              value={propKey}
              onChange={(e) => setPropKey(e.target.value)}
            >
              {propKeys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            {tiers.length > 1 && (
              <p className={styles.propHint}>{tiers.length} tiers — use per-leg range to target a threshold</p>
            )}
          </div>
          <div className={styles.card}>
            <div className={styles.stepLabel}>3 — Legs</div>
            <select
              className={styles.select}
              value={numLegs}
              onChange={(e) => setNumLegs(Number(e.target.value))}
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Odds format */}
        <div className={styles.card}>
          <div className={styles.stepLabel}>Odds format</div>
          <div className={styles.fmtRow}>
            {(['american', 'decimal'] as OddsFormat[]).map((f) => (
              <button
                key={f}
                className={`${styles.fmtBtn} ${oddsFormat === f ? styles.active : ''}`}
                onClick={() => setOddsFormat(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4 — Odds filters */}
        <div className={styles.card}>
          <div className={styles.stepLabel}>4 — Odds filters</div>

          {/* Per-leg */}
          <SliderSection
            label="Per-leg odds range"
            min={-1000} max={5000} step={25}
            valueMin={legMin} valueMax={legMax}
            unlimited={legUnlimited}
            onMinChange={setLegMin}
            onMaxChange={setLegMax}
            onUnlimitedChange={setLegUnlimited}
            endMin="-1000" endMax="+5000"
          />

          <div className={styles.divider} />

          {/* Parlay */}
          <SliderSection
            label="Overall parlay odds range"
            min={-200} max={150000} step={100}
            valueMin={parlayMin} valueMax={parlayMax}
            unlimited={parlayUnlimited}
            onMinChange={setParlayMin}
            onMaxChange={setParlayMax}
            onUnlimitedChange={setParlayUnlimited}
            endMin="-200" endMax="+150000"
          />
        </div>

        {/* Generate button */}
        <button className={styles.genBtn} onClick={handleGenerate}>
          Generate Random Parlay
        </button>

        {/* Mid ad */}
        <AdSlot slot="MID_AD_SLOT_ID" />

        {/* Results */}
        {error && (
          <div className={styles.errorState}>{error}</div>
        )}

        {legs && (
          <>
            <div className={styles.parlayCard}>
              <div className={styles.parlayHeader}>
                <span className={styles.parlayTitle}>{legs.length}-Leg {league.toUpperCase()} Parlay</span>
                <div style={{ textAlign: 'right' }}>
                  <div className={styles.parlayOddsLabel}>Parlay odds</div>
                  <div className={styles.parlayOddsVal}>
                    {oddsFormat === 'decimal'
                      ? `${legs.reduce((a, l) => a * toDecimal(l.oddsRaw), 1).toFixed(2)}x`
                      : formatAmerican(parlayAm)}
                  </div>
                </div>
              </div>
              {legs.map((leg, i) => (
                <div key={i} className={styles.legRow}>
                  <span className={styles.legNum}>{i + 1}</span>
                  <span className={styles.legEmoji}>{leg.emoji}</span>
                  <div className={styles.legInfo}>
                    <div className={styles.legPlayer}>{leg.player}</div>
                    <div className={styles.legProp}>{leg.label}</div>
                  </div>
                  <span className={`${styles.legOdds} ${styles[oddsClass(leg.oddsRaw)]}`}>
                    {formatOdds(leg.oddsRaw, oddsFormat)}
                  </span>
                </div>
              ))}
            </div>

            {/* Wager calculator */}
            <div className={styles.wagerRow}>
              <div className={styles.wagerBox}>
                <span className={styles.wagerLabel}>Wager $</span>
                <input
                  type="number"
                  className={styles.wagerInput}
                  value={wager}
                  min={1}
                  onChange={(e) => setWager(Number(e.target.value))}
                />
              </div>
              <div className={styles.metricBox}>
                <div className={styles.metricLabel}>To win</div>
                <div className={`${styles.metricVal} ${styles.win}`}>${toWin}</div>
              </div>
              <div className={styles.metricBox}>
                <div className={styles.metricLabel}>Total return</div>
                <div className={styles.metricVal}>${totalReturn}</div>
              </div>
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? '✓ Copied!' : '⎘ Copy'}
              </button>
            </div>
          </>
        )}

        {/* Bottom ad */}
        <AdSlot slot="BOTTOM_AD_SLOT_ID" style={{ marginTop: 24 }} />

        {/* Disclaimer */}
        <p className={styles.disclaimer}>
          For entertainment purposes only. This is not a gambling service.
          Odds shown are simulated and do not reflect actual sportsbook lines.
        </p>
      </div>
    </main>
  )
}

// Inline slider section component
function SliderSection({
  label, min, max, step,
  valueMin, valueMax, unlimited,
  onMinChange, onMaxChange, onUnlimitedChange,
  endMin, endMax,
}: {
  label: string; min: number; max: number; step: number
  valueMin: number; valueMax: number; unlimited: boolean
  onMinChange: (v: number) => void; onMaxChange: (v: number) => void
  onUnlimitedChange: (v: boolean) => void
  endMin: string; endMax: string
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  const loP = pct(valueMin)
  const hiP = unlimited ? 100 : pct(valueMax)
  const fmt = (v: number) => (v > 0 ? `+${v}` : `${v}`)
  const parse = (s: string) => parseInt(s.replace(/[^0-9\-]/g, ''), 10)

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={unlimited} onChange={e => onUnlimitedChange(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#E24B4A' }} />
          Unlimited max
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <ValBox label="Min" value={fmt(valueMin)} onCommit={s => {
          let v = parse(s); if (isNaN(v)) return
          v = Math.max(min, Math.min(unlimited ? max : valueMax, v))
          onMinChange(v)
        }} />
        <ValBox label="Max" value={unlimited ? '∞' : fmt(valueMax)} disabled={unlimited} onCommit={s => {
          let v = parse(s); if (isNaN(v)) return
          v = Math.max(valueMin, v)
          onMaxChange(v)
        }} />
      </div>
      <div style={{ position: 'relative', height: 22, marginBottom: 4 }}>
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', height: 4, borderRadius: 2, background: 'var(--color-border)' }} />
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `${loP}%`, width: `${hiP - loP}%`, height: 4, borderRadius: 2, background: '#E24B4A' }} />
        <input type="range" min={min} max={max} step={step} value={valueMin}
          onChange={e => onMinChange(Math.min(parseInt(e.target.value), unlimited ? max : valueMax))}
          style={{ position: 'absolute', width: '100%', height: 4, top: '50%', transform: 'translateY(-50%)', appearance: 'none', background: 'transparent', pointerEvents: 'none', margin: 0 } as React.CSSProperties}
        />
        <input type="range" min={min} max={max} step={step} value={Math.min(valueMax, max)}
          disabled={unlimited}
          onChange={e => onMaxChange(Math.max(parseInt(e.target.value), valueMin))}
          style={{ position: 'absolute', width: '100%', height: 4, top: '50%', transform: 'translateY(-50%)', appearance: 'none', background: 'transparent', pointerEvents: 'none', margin: 0, opacity: unlimited ? 0.35 : 1 } as React.CSSProperties}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{endMin}</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{endMax}</span>
      </div>
    </div>
  )
}

function ValBox({ label, value, disabled, onCommit }: { label: string; value: string; disabled?: boolean; onCommit: (s: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isFocused = useRef(false)

  // Sync the input's displayed value from parent ONLY when not focused
  useEffect(() => {
    if (!isFocused.current && inputRef.current) {
      inputRef.current.value = disabled ? '∞' : value
    }
  }, [value, disabled])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: disabled ? 0.4 : 1 }}>
      <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--color-text-secondary)' }}>{label}</span>
      <input
        ref={inputRef}
        type="text"
        defaultValue={disabled ? '∞' : value}
        disabled={disabled}
        onFocus={() => { isFocused.current = true }}
        onBlur={e => {
          isFocused.current = false
          onCommit(e.target.value)
        }}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', border: '1.5px solid var(--color-border)', borderRadius: 6, background: 'var(--color-bg-secondary)', padding: '3px 8px', width: 90, textAlign: 'center', outline: 'none', fontFamily: "'DM Sans', sans-serif", cursor: disabled ? 'default' : 'text' }}
      />
    </div>
  )
}
