import { profile } from '../data'
import PillNav from './PillNav'
import RevealText from './RevealText'
import Typewriter from './Typewriter'

export type View = 'projects' | 'about'

type Props = {
  view: View
  onViewChange: (view: View) => void
}

const previouslyLink = {
  text: profile.previously.label,
  href: profile.previously.href,
  className: 'text-ink underline underline-offset-2 hover:text-accent',
}

export default function Header({ view, onViewChange }: Props) {
  return (
    <header className="grid gap-8 pt-48 sm:grid-cols-2 sm:gap-4 sm:pt-48">
      <div className="flex flex-col">
        {/* Phones: photo always visible above the name */}
        <img
          src={profile.photo}
          alt=""
          className="animate-fade-up mb-4 h-[88px] w-[70px] rounded-full object-cover grayscale sm:hidden"
        />
        <h1
          tabIndex={0}
          className="group relative self-start text-[22px] leading-none font-medium tracking-[-0.035em] outline-none sm:text-[26px]"
        >
          {/* Desktop: photo pops up above the name on hover / focus */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-full left-0 mb-3 hidden h-[84px] w-[104px] origin-bottom-left scale-50 overflow-hidden rounded-[50%] opacity-0 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.3)] ring-4 ring-white/90 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 sm:block"
          >
            <img src={profile.photo} alt="" className="size-full object-cover grayscale" />
          </span>
          {profile.name}
        </h1>
        <Typewriter words={profile.roles} startDelay={400} className="label mt-2 max-sm:text-[14px]" />
        <p className="label mt-8 hidden sm:mt-auto sm:block">based in {profile.location}</p>
      </div>

      {/* Phones: one paragraph, then the two tabs */}
      <div className="sm:hidden">
        <RevealText
          parts={[
            { text: 'Previously at ', reveal: false },
            { ...previouslyLink, className: 'text-muted', reveal: false },
            { text: ',', reveal: false },
            ` ${profile.tagline}`,
          ]}
          delay={0.3}
          className="text-[17px] leading-[1.6] tracking-[-0.01em]"
        />
        <div className="animate-fade-up mt-6 flex gap-3 [animation-delay:700ms]">
          {(['projects', 'about'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onViewChange(option)}
              aria-current={view === option ? 'page' : undefined}
              className={`rounded-full px-[18px] py-2 text-[15px] capitalize transition-colors ${
                view === option ? 'bg-ink text-white' : 'bg-black/[0.06] text-ink'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: pills, tagline, previously */}
      <div className="hidden sm:block">
        <div className="animate-fade-up [animation-delay:200ms]">
          <PillNav view={view} onViewChange={onViewChange} />
        </div>
        <RevealText
          parts={[profile.tagline]}
          delay={0.3}
          className="mt-3 max-w-[360px] text-[28px] leading-[1.08] font-medium tracking-[-0.04em]"
        />
        <p className="label mt-3">
          previously at{' '}
          <a
            href={previouslyLink.href}
            target="_blank"
            rel="noreferrer"
            className={previouslyLink.className}
          >
            {previouslyLink.text}
          </a>
        </p>
      </div>
    </header>
  )
}
