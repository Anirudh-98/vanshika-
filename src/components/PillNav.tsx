import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data'
import type { View } from './Header'

type Item = { id: View | 'resume'; label: string; href?: string }

const items: Item[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume', href: profile.resume },
]

type Props = {
  view: View
  onViewChange: (view: View) => void
}

/**
 * Pills sit stacked behind the active one and fan out on hover
 * (or on first tap on touch screens, or on keyboard focus).
 */
export default function PillNav({ view, onViewChange }: Props) {
  const [open, setOpen] = useState(false)
  const [lefts, setLefts] = useState<number[]>([])
  const navRef = useRef<HTMLElement>(null)
  const pillRefs = useRef<(HTMLElement | null)[]>([])
  const pointerType = useRef('mouse')

  const measure = useCallback(() => {
    setLefts(pillRefs.current.map((el) => el?.offsetLeft ?? 0))
  }, [])

  useLayoutEffect(() => {
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // Close when tapping outside on touch screens
  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const activeIndex = items.findIndex((item) => item.id === view)
  const inactive = items.map((_, i) => i).filter((i) => i !== activeIndex)

  const collapsedX = (i: number) => {
    const peek = i === activeIndex ? 0 : 10 + inactive.indexOf(i) * 6
    return peek - (lefts[i] ?? 0)
  }

  const handleClick = (event: React.MouseEvent, item: Item) => {
    // First tap on touch only fans the pills out
    if (!open && pointerType.current !== 'mouse') {
      event.preventDefault()
      setOpen(true)
      return
    }
    if (item.id !== 'resume') {
      onViewChange(item.id)
      setOpen(false)
    }
  }

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!navRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
      className="relative flex gap-1.5 text-[12px] font-medium"
    >
      {items.map((item, i) => {
        const active = i === activeIndex
        const Tag = item.href ? 'a' : 'button'
        return (
          <Tag
            key={item.id}
            ref={(el: HTMLElement | null) => {
              pillRefs.current[i] = el
            }}
            {...(item.href
              ? { href: item.href, target: '_blank', rel: 'noreferrer' }
              : { type: 'button' as const, 'aria-current': active ? ('page' as const) : undefined })}
            onPointerDown={(e: React.PointerEvent) => (pointerType.current = e.pointerType)}
            onPointerEnter={(e: React.PointerEvent) => e.pointerType === 'mouse' && setOpen(true)}
            onClick={(e: React.MouseEvent) => handleClick(e, item)}
            style={{
              transform: open ? 'translateX(0)' : `translateX(${collapsedX(i)}px)`,
              transitionDelay: open ? `${i * 40}ms` : '0ms',
              zIndex: active ? 30 : 20 - inactive.indexOf(i),
            }}
            className={`relative rounded-full px-3.5 py-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.06)] transition-[transform,background-color,color,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              active
                ? open
                  ? 'bg-ink text-white'
                  : 'bg-neutral-200 text-ink'
                : `bg-neutral-100 text-ink ring-1 ring-black/[0.04] hover:bg-neutral-200 ${
                    open ? 'opacity-100' : 'opacity-70'
                  }`
            }`}
          >
            {item.label}
          </Tag>
        )
      })}
    </nav>
  )
}
