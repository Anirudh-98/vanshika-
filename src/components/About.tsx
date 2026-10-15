import { profile } from '../data'
import PhotoStack from './PhotoStack'

export default function About() {
  const { about } = profile

  return (
    <section className="animate-fade-up pt-36 sm:pt-40">
      <h2 className="label">60s intro video</h2>
      <div className="-mx-4 mt-6 aspect-video overflow-hidden bg-neutral-900">
        {about.video ? (
          <video
            src={about.video}
            poster={about.videoPoster}
            controls
            preload="metadata"
            className="size-full object-cover"
          />
        ) : (
          <div className="relative size-full">
            <img src={about.videoPoster} alt="" className="size-full object-cover" />
            <p className="label absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-10 pb-4 !text-white/90">
              add your intro video in src/data.ts
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-6">
        <a href={`mailto:${profile.email}`} className="label flex items-center gap-1.5 !text-ink hover:!text-accent">
          <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-none stroke-current stroke-[1.25]" strokeLinecap="round">
            <path d="M10.5 4.5 5.4 9.6a1.3 1.3 0 0 0 1.8 1.8l5.4-5.4a2.6 2.6 0 0 0-3.7-3.7L3.5 7.7a3.9 3.9 0 0 0 5.5 5.5l4-4" />
          </svg>
          email
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="label flex items-center gap-1.5 !text-ink hover:!text-accent"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-none stroke-current stroke-[1.1]">
            <rect x="2" y="2" width="12" height="12" rx="1" />
            <path d="M5 7v4.5M5 5v.01M7.5 11.5V7m0 2a1.8 1.8 0 0 1 3.5 0v2.5" strokeLinecap="round" />
          </svg>
          linkedin
        </a>
      </div>

      <div className="mt-16 border-t border-dashed border-black/10" />

      <div className="mt-16 grid items-center gap-16 sm:grid-cols-2 sm:gap-4">
        <div>
          <h2 className="label">the text version</h2>
          <p className="mt-6 max-w-[330px] text-[20px] leading-[1.2] font-medium tracking-[-0.03em]">
            {about.heading}
          </p>
          <div className="mt-4 flex max-w-[320px] flex-col gap-3 text-[13px] leading-relaxed text-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <PhotoStack photos={about.photos} />
      </div>
    </section>
  )
}
