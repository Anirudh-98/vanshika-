import { useEffect, useState } from 'react'

type Props = {
  words: string[]
  /** Milliseconds to wait before typing starts. */
  startDelay?: number
  className?: string
}

/** Types and deletes each word in turn, with a blinking caret. */
export default function Typewriter({ words, startDelay = 0, className }: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [started, setStarted] = useState(startDelay === 0)

  const word = words[wordIndex % words.length]

  useEffect(() => {
    if (started) return
    const timer = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timer)
  }, [started, startDelay])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLength(word.length)
      return
    }
    if (!started) return

    let delay = deleting ? 45 : 90
    if (!deleting && length === word.length) delay = 1800
    if (deleting && length === 0) delay = 300

    const timer = setTimeout(() => {
      if (!deleting && length === word.length) {
        setDeleting(true)
      } else if (deleting && length === 0) {
        setDeleting(false)
        setWordIndex((i) => i + 1)
      } else {
        setLength((l) => l + (deleting ? -1 : 1))
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [length, deleting, word, started])

  return (
    <p className={className} aria-label={words[0]}>
      <span aria-hidden>{word.slice(0, length)}</span>
      <span aria-hidden className="animate-blink">
        |
      </span>
    </p>
  )
}
