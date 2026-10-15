import { useEffect, useRef, useState } from 'react'

/** Sound toggle: when on, links and buttons play a soft tick on hover. */
export function SoundToggle() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (!on) return
    ctxRef.current ??= new AudioContext()
    const ctx = ctxRef.current

    const tick = (event: PointerEvent) => {
      const target = event.target as Element
      const related = event.relatedTarget as Element | null
      const el = target.closest('a, button')
      if (!el || (related && el.contains(related))) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 1400
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    }

    document.addEventListener('pointerover', tick)
    return () => document.removeEventListener('pointerover', tick)
  }, [on])

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
      aria-pressed={on}
      className="grid size-11 place-items-center rounded-full bg-black/[0.03] text-muted ring-1 ring-black/[0.04] transition-colors hover:bg-black/[0.06] hover:text-ink"
    >
      <svg viewBox="0 0 16 16" className="size-5 fill-none stroke-current stroke-[1.1]">
        <path d="M2.5 6h2.5l3.5-3v10l-3.5-3h-2.5z" strokeLinejoin="round" />
        {on ? (
          <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" strokeLinecap="round" />
        ) : (
          <path d="m11 6 3.5 4M14.5 6 11 10" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}

/** Small accent dot that trails the pointer on devices with a mouse. */
export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dot = dotRef.current
    if (!finePointer || reduced || !dot) return

    let x = window.innerWidth - 120
    let y = 60
    let tx = x
    let ty = y
    let frame = 0

    const move = (event: PointerEvent) => {
      tx = event.clientX + 14
      ty = event.clientY + 14
    }
    const loop = () => {
      x += (tx - x) * 0.15
      y += (ty - y) * 0.15
      dot.style.transform = `translate(${x}px, ${y}px)`
      frame = requestAnimationFrame(loop)
    }

    dot.style.opacity = '1'
    window.addEventListener('pointermove', move)
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50 size-2.5 rounded-full bg-accent opacity-0"
    />
  )
}
