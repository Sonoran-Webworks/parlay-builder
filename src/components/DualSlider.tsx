'use client'

import { useRef, useEffect, useCallback } from 'react'

interface DualSliderProps {
  min: number
  max: number
  step: number
  valueMin: number
  valueMax: number
  unlimitedMax: boolean
  onMinChange: (v: number) => void
  onMaxChange: (v: number) => void
  onUnlimitedChange: (v: boolean) => void
  label: string
  rangeEndMin: string
  rangeEndMax: string
  inputMinId: string
  inputMaxId: string
}

export default function DualSlider({
  min, max, step,
  valueMin, valueMax,
  unlimitedMax,
  onMinChange, onMaxChange, onUnlimitedChange,
  label,
  rangeEndMin, rangeEndMax,
  inputMinId, inputMaxId,
}: DualSliderProps) {
  const fillRef = useRef<HTMLDivElement>(null)
  const minInputRef = useRef<HTMLInputElement>(null)
  const maxInputRef = useRef<HTMLInputElement>(null)
  const minBoxRef = useRef<HTMLInputElement>(null)
  const maxBoxRef = useRef<HTMLInputElement>(null)

  const pct = useCallback((v: number) => ((v - min) / (max - min)) * 100, [min, max])

  // Sync fill track
  useEffect(() => {
    if (!fillRef.current) return
    if (unlimitedMax) {
      fillRef.current.style.left = '0%'
      fillRef.current.style.width = '100%'
    } else {
      const lo = pct(valueMin)
      const hi = pct(valueMax)
      fillRef.current.style.left = `${lo}%`
      fillRef.current.style.width = `${hi - lo}%`
    }
  }, [valueMin, valueMax, unlimitedMax, pct])

  const fmt = (v: number) => (v > 0 ? `+${v}` : `${v}`)
  const parse = (s: string) => parseInt(s.replace(/[^0-9\-]/g, ''), 10)

  function handleMinSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.target.value)
    const clamped = Math.min(v, unlimitedMax ? max : valueMax)
    onMinChange(clamped)
    if (minBoxRef.current) minBoxRef.current.value = fmt(clamped)
  }

  function handleMaxSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.target.value)
    const clamped = Math.max(v, valueMin)
    onMaxChange(clamped)
    if (maxBoxRef.current) maxBoxRef.current.value = fmt(clamped)
  }

  function commitMinBox() {
    if (!minBoxRef.current) return
    let v = parse(minBoxRef.current.value)
    if (isNaN(v)) v = valueMin
    v = Math.max(min, Math.min(max, v))
    if (!unlimitedMax) v = Math.min(v, valueMax)
    onMinChange(v)
    minBoxRef.current.value = fmt(v)
    if (minInputRef.current) minInputRef.current.value = String(v)
  }

  function commitMaxBox() {
    if (!maxBoxRef.current || unlimitedMax) return
    let v = parse(maxBoxRef.current.value)
    if (isNaN(v)) v = valueMax
    // Allow values beyond slider max (truly unlimited when typed)
    v = Math.max(valueMin, v)
    onMaxChange(v)
    maxBoxRef.current.value = fmt(v)
    if (maxInputRef.current) maxInputRef.current.value = String(Math.min(max, v))
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={unlimitedMax}
            onChange={(e) => onUnlimitedChange(e.target.checked)}
            style={{ width: 15, height: 15, accentColor: '#E24B4A' }}
          />
          Unlimited max
        </label>
      </div>

      {/* Value boxes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--color-text-secondary)' }}>Min</span>
          <input
            id={inputMinId}
            ref={minBoxRef}
            type="text"
            defaultValue={fmt(valueMin)}
            onBlur={commitMinBox}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitMinBox() } }}
            style={boxStyle}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: unlimitedMax ? 0.4 : 1 }}>
          <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--color-text-secondary)' }}>Max</span>
          <input
            id={inputMaxId}
            ref={maxBoxRef}
            type="text"
            defaultValue={unlimitedMax ? '∞' : fmt(valueMax)}
            disabled={unlimitedMax}
            onBlur={commitMaxBox}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitMaxBox() } }}
            style={{ ...boxStyle, cursor: unlimitedMax ? 'default' : 'text' }}
          />
        </div>
      </div>

      {/* Dual range track */}
      <div style={{ position: 'relative', height: 22, marginBottom: 4 }}>
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', height: 4, borderRadius: 2, background: 'var(--color-border)' }} />
        <div ref={fillRef} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', height: 4, borderRadius: 2, background: '#E24B4A' }} />
        <input
          ref={minInputRef}
          type="range"
          min={min} max={max} step={step}
          defaultValue={valueMin}
          onChange={handleMinSlider}
          style={rangeStyle}
        />
        <input
          ref={maxInputRef}
          type="range"
          min={min} max={max} step={step}
          defaultValue={valueMax}
          disabled={unlimitedMax}
          onChange={handleMaxSlider}
          style={{ ...rangeStyle, opacity: unlimitedMax ? 0.35 : 1 }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{rangeEndMin}</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{rangeEndMax}</span>
      </div>
    </div>
  )
}

const boxStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  color: 'var(--color-text-primary)',
  border: '1.5px solid var(--color-border)',
  borderRadius: 6,
  background: 'var(--color-bg-secondary)',
  padding: '3px 8px',
  width: 90,
  textAlign: 'center',
  outline: 'none',
}

const rangeStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: 4,
  top: '50%',
  transform: 'translateY(-50%)',
  appearance: 'none',
  background: 'transparent',
  pointerEvents: 'none',
  margin: 0,
}
