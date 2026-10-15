import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

type Part =
  | string
  | {
      text: string
      href?: string
      className?: string
      /** Set false to show this part immediately, without the block wipe. */
      reveal?: boolean
    }

type Props = {
  parts: Part[]
  /** Seconds before the first line starts. */
  delay?: number
  className?: string
  as?: 'p' | 'span'
}

type Word = { text: string; part: number; spaceBefore: boolean; reveal: boolean }

const BLOCK_SECONDS = 0.9
const STAGGER_SECONDS = 0.1

/**
 * Reveals text line by line: an accent block wipes in over each rendered line,
 * then wipes out to uncover the text. Lines are measured, so it follows the
 * real wrapping at any screen width.
 */
export default function RevealText({ parts, delay = 0, className, as: Tag = 'p' }: Props) {
  const words = useMemo(() => splitWords(parts), [parts])
  const [lines, setLines] = useState<number[][] | null>(null)
  const [done, setDone] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const measureRef = useRef<HTMLElement>(null)

  // Group words into lines by their offsetTop once fonts are ready
  useLayoutEffect(() => {
    if (done) return
    let cancelled = false
    const measure = () => {
      const spans = measureRef.current?.querySelectorAll<HTMLElement>('[data-word]')
      if (!spans || cancelled) return
      const grouped: number[][] = []
      let lastTop = -Infinity
      spans.forEach((span, i) => {
        if (span.offsetTop > lastTop + 2) {
          grouped.push([])
          lastTop = span.offsetTop
        }
        grouped[grouped.length - 1].push(i)
      })
      setLines(grouped)
    }
    if (document.fonts) document.fonts.ready.then(measure)
    else measure()
    return () => {
      cancelled = true
    }
  }, [done])

  // Swap back to plain text when the animation has finished
  useEffect(() => {
    if (!lines || done) return
    const animatedLines = lines.filter((line) => line.some((i) => words[i].reveal)).length
    const total = delay + Math.max(animatedLines - 1, 0) * STAGGER_SECONDS + BLOCK_SECONDS
    const timer = setTimeout(() => setDone(true), total * 1000 + 50)
    return () => clearTimeout(timer)
  }, [lines, done, delay, words])

  const renderWord = (word: Word, i: number) => {
    const part = parts[word.part]
    const content =
      typeof part !== 'string' && part.href ? (
        <a href={part.href} target="_blank" rel="noreferrer" className={part.className}>
          {word.text}
        </a>
      ) : (
        <span className={typeof part === 'string' ? undefined : part.className}>{word.text}</span>
      )
    return (
      <span key={i} data-word>
        {content}
      </span>
    )
  }

  const renderRun = (indices: number[]) =>
    indices.map((wordIndex, j) => (
      <span key={wordIndex}>
        {j > 0 && words[wordIndex].spaceBefore ? ' ' : ''}
        {renderWord(words[wordIndex], wordIndex)}
      </span>
    ))

  const plain = words.map((w, i) => (
    <span key={i}>
      {i > 0 && w.spaceBefore ? ' ' : ''}
      {renderWord(w, i)}
    </span>
  ))

  if (done) return <Tag className={className}>{plain}</Tag>

  if (!lines) {
    return (
      <Tag ref={measureRef as React.Ref<HTMLParagraphElement>} className={`${className ?? ''} opacity-0`}>
        {plain}
      </Tag>
    )
  }

  let animatedIndex = 0
  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => {
        // Split the line into runs of revealed / static words
        const runs: { reveal: boolean; indices: number[] }[] = []
        line.forEach((i) => {
          const last = runs[runs.length - 1]
          if (last && last.reveal === words[i].reveal) last.indices.push(i)
          else runs.push({ reveal: words[i].reveal, indices: [i] })
        })
        const lineDelay = delay + animatedIndex * STAGGER_SECONDS
        if (runs.some((run) => run.reveal)) animatedIndex++

        return (
          <span key={lineIndex} className="block">
            {runs.map((run, r) => (
              <span key={r}>
                {r > 0 && words[run.indices[0]].spaceBefore ? ' ' : ''}
                {run.reveal ? (
                  <span
                    className="reveal-seg"
                    style={{ '--reveal-delay': `${lineDelay}s` } as React.CSSProperties}
                  >
                    <span className="reveal-text">{renderRun(run.indices)}</span>
                  </span>
                ) : (
                  renderRun(run.indices)
                )}
              </span>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}

function splitWords(parts: Part[]): Word[] {
  const words: Word[] = []
  let prevEndedWithSpace = false
  parts.forEach((part, partIndex) => {
    const text = typeof part === 'string' ? part : part.text
    const reveal = typeof part === 'string' || part.reveal !== false
    for (const match of text.matchAll(/\S+/g)) {
      const index = match.index ?? 0
      const spaceBefore = index > 0 ? /\s/.test(text[index - 1]) : prevEndedWithSpace
      words.push({ text: match[0], part: partIndex, spaceBefore, reveal })
    }
    prevEndedWithSpace = /\s$/.test(text)
  })
  return words
}
