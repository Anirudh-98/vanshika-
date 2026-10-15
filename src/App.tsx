import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect, useRef, useState } from 'react'
import About from './components/About'
import { CursorDot, SoundToggle } from './components/Ambient'
import Footer from './components/Footer'
import Header, { type View } from './components/Header'
import MobileMenu from './components/MobileMenu'
import Projects from './components/Projects'

function App() {
  const [view, setView] = useState<View>('projects')
  const lenisRef = useRef<Lenis | null>(null)

  // Smooth scrolling (skipped for people who prefer reduced motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09 })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const changeView = (next: View) => {
    setView(next)
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }

  const onAbout = view === 'about'

  return (
    <>
      <CursorDot />
      <div className="relative mx-auto min-h-svh max-w-[750px] px-4">
        <GuideLines />

        {onAbout && (
          <button
            type="button"
            onClick={() => changeView('projects')}
            aria-label="Back to projects"
            className="absolute top-14 left-4 z-20 grid size-11 place-items-center rounded-full bg-black/[0.03] text-muted ring-1 ring-black/[0.04] transition-colors hover:bg-black/[0.06] hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="size-5 fill-none stroke-current stroke-[1.1]" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8H3m4-4L3 8l4 4" />
            </svg>
          </button>
        )}

        <div
          className={`absolute right-4 z-20 flex gap-2 ${
            onAbout ? 'top-14' : 'top-20 sm:top-6 lg:top-14 lg:-right-24'
          }`}
        >
          <SoundToggle />
          <MobileMenu onViewChange={changeView} />
        </div>

        <div className="relative">
          {onAbout ? (
            <main>
              <About />
            </main>
          ) : (
            <>
              <Header view={view} onViewChange={changeView} />
              <main className="mt-28 sm:mt-48">
                <Projects />
              </main>
            </>
          )}

          <Footer />
        </div>
      </div>
    </>
  )
}

/** Dashed 6-column guides (2 on phones) running the full page height. */
function GuideLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 guide-x">
      <div className="grid h-full grid-cols-2 gap-4 px-4 sm:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`guide-x ${i >= 2 ? 'hidden sm:block' : ''}`} />
        ))}
      </div>
    </div>
  )
}

export default App
