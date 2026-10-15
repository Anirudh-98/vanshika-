import { useRef, useState } from 'react'

type Props = {
  photos: string[]
}

const THROW_DISTANCE = 70

/** A fanned stack of photos. Click or drag the top one away to send it to the back. */
export default function PhotoStack({ photos }: Props) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i))
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)
  const start = useRef({ x: 0, y: 0 })

  const next = () => setOrder((o) => [...o.slice(1), o[0]])

  const onPointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current = { x: event.clientX, y: event.clientY }
    setDrag({ x: 0, y: 0 })
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag) return
    setDrag({ x: event.clientX - start.current.x, y: event.clientY - start.current.y })
  }

  const onPointerUp = () => {
    if (!drag) return
    const distance = Math.hypot(drag.x, drag.y)
    // A click (barely moved) or a throw both cycle to the next photo
    if (distance < 5 || distance > THROW_DISTANCE) next()
    setDrag(null)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-square w-[240px] sm:w-[272px]">
        {order
          .map((photoIndex, position) => ({ photoIndex, position }))
          .reverse()
          .map(({ photoIndex, position }) => {
            const top = position === 0
            const offset = top && drag ? drag : { x: 0, y: 0 }
            const transform = top
              ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x / 18}deg)`
              : `translate(${position * 12}px, ${-position * 7}px) rotate(${position * 4}deg) scale(${1 - position * 0.03})`

            return (
              <div
                key={photoIndex}
                onPointerDown={top ? onPointerDown : undefined}
                onPointerMove={top ? onPointerMove : undefined}
                onPointerUp={top ? onPointerUp : undefined}
                onPointerCancel={top ? () => setDrag(null) : undefined}
                style={{ transform, zIndex: photos.length - position }}
                className={`absolute inset-0 overflow-hidden rounded-[22px] bg-neutral-200 ring-1 ring-black/[0.06] select-none ${
                  top
                    ? 'cursor-grab touch-none shadow-[0_18px_40px_-16px_rgb(0_0_0/0.45)] active:cursor-grabbing'
                    : 'shadow-[0_8px_20px_-12px_rgb(0_0_0/0.3)]'
                } ${drag && top ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]'}`}
              >
                <img
                  src={photos[photoIndex]}
                  alt=""
                  draggable={false}
                  className={`size-full object-cover ${top ? '' : 'grayscale'}`}
                />
              </div>
            )
          })}
      </div>
      <p className="label mt-6 flex items-center gap-2">
        <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-none stroke-current stroke-[1.25]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8V3.5a1 1 0 0 1 2 0V7m0-1a1 1 0 0 1 2 0v1m0-.5a1 1 0 0 1 2 0V10a4 4 0 0 1-4 4h-.5a4 4 0 0 1-3.2-1.6L3 10.5a1 1 0 0 1 1.6-1.2L6 10.5M2 3l1.5 1.5M2 6h1.5M14 3l-1.5 1.5" />
        </svg>
        click &amp; drag
      </p>
    </div>
  )
}
