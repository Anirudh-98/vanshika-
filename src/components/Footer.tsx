import { profile } from '../data'

export default function Footer() {
  const links = [
    { label: 'Email', href: `mailto:${profile.email}` },
    { label: 'LinkedIn', href: profile.socials.linkedin },
    { label: 'Behance', href: profile.socials.behance },
  ]

  return (
    <footer className="mt-32 border-t border-dashed border-black/10 pt-8 pb-10 sm:mt-40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          ©{new Date().getFullYear()} {profile.name} | all rights reserved
        </p>
        <ul className="flex gap-4">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className="label !text-ink hover:!text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="label mt-5">♥ built with react &amp; tailwind</p>
    </footer>
  )
}
