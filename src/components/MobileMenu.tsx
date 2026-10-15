import { useEffect, useRef, useState } from 'react'
import { profile } from '../data'
import type { View } from './Header'

type Props = {
  onViewChange: (view: View) => void
}

/** Hamburger menu shown on phones only. */
export default function MobileMenu({ onViewChange }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (view: View) => {
    onViewChange(view)
    setOpen(false)
  }

  const itemClass =
    'block w-full rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors hover:bg-black/[0.04]'

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="grid size-11 place-items-center rounded-full bg-black/[0.03] text-muted ring-1 ring-black/[0.04] transition-colors hover:text-ink"
      >
        <svg viewBox="0 0 16 16" className="size-5 fill-none stroke-current stroke-[1.1]" strokeLinecap="round">
          {open ? (
            <path d="m4 4 8 8M12 4l-8 8" />
          ) : (
            <path d="M3 4.5h10M3 8h10M3 11.5h10" />
          )}
        </svg>
      </button>

      <div
        className={`absolute top-13 right-0 w-52 origin-top-right rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)] ring-1 ring-black/[0.06] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
        }`}
      >
        <button type="button" className={itemClass} onClick={() => go('projects')}>
          Projects
        </button>
        <button type="button" className={itemClass} onClick={() => go('about')}>
          About
        </button>
        <a href={profile.resume} target="_blank" rel="noreferrer" className={itemClass}>
          Resume ↗
        </a>
        <div className="my-1 h-px bg-black/[0.06]" />
        <a href={`mailto:${profile.email}`} className={`${itemClass} text-muted`}>
          Email
        </a>
        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className={`${itemClass} text-muted`}>
          LinkedIn ↗
        </a>
        <a href={profile.socials.behance} target="_blank" rel="noreferrer" className={`${itemClass} text-muted`}>
          Behance ↗
        </a>
      </div>
    </div>
  )
}
