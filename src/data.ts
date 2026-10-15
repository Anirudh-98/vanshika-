// Edit this file to put in your own details, projects and links.

export type FeaturedProject = {
  company: string
  title: string
  summary: string
  href: string
  /** Two phone screenshots (put files in /public/images). */
  screens: [string, string]
  /** Tailwind gradient stop for the card's bottom tint. */
  tint: string
  /** 'end' shows the bottom of the phones, 'start' shows the top. */
  align: 'start' | 'end'
}

export type OtherProject = {
  title: string
  summary: string
  href: string
  image: string
}

export const profile = {
  name: 'Your Name',
  /** Shown above your name on hover. Replace with your own photo. */
  photo: '/images/portrait.webp',
  roles: ['product designer', 'visual designer', 'interaction designer'],
  location: 'Bengaluru',
  tagline: 'I design products that feel simple, honest and quietly delightful.',
  previously: { label: 'Company Name', href: 'https://example.com' },
  resume: 'https://example.com/resume.pdf',
  email: 'hello@example.com',
  socials: {
    linkedin: 'https://www.linkedin.com/',
    behance: 'https://www.behance.net/',
  },
  about: {
    /** Path to your intro video in /public, e.g. '/intro.mp4'. Leave empty to show the poster only. */
    video: '',
    videoPoster: '/images/about-video-poster.webp',
    heading: 'It all started with doodles in the margins of my school notebooks',
    paragraphs: [
      'Write how your interest in design began and the path that led you to product design.',
      'Share what you enjoy outside of work: hobbies, sports, side projects, things you collect.',
      'End with what you are exploring or learning right now.',
    ],
    /** Photos for the click & drag stack (first one is on top). */
    photos: [
      '/images/about-photo-1.webp',
      '/images/about-photo-2.webp',
      '/images/about-photo-3.webp',
      '/images/portrait.webp',
    ],
  },
}

export const featured: FeaturedProject[] = [
  {
    company: 'Company A',
    title: 'Designing for category discoverability',
    summary:
      'A one-line summary of the problem: categories were growing faster than people could navigate them.',
    href: '#',
    screens: ['/images/project1-mobile-2.webp', '/images/project1-mobile.webp'],
    tint: 'to-amber-50',
    align: 'end',
  },
  {
    company: 'Startup B',
    title: 'Making pricing feel transparent',
    summary:
      'Designing the MVP for an end-to-end laundry service, from booking a pickup to understanding the bill.',
    href: '#',
    screens: ['/images/project3-mobile.webp', '/images/project3-mobile-2.webp'],
    tint: 'to-indigo-50',
    align: 'start',
  },
  {
    company: 'Company A',
    title: 'Visual design showcase',
    summary:
      'Campaigns, category pages and visual polish shipped across the app over the year.',
    href: '#',
    screens: ['/images/project2-mobile.webp', '/images/project2-mobile-2.webp'],
    tint: 'to-emerald-50',
    align: 'start',
  },
]

export const others: OtherProject[] = [
  {
    title: 'Redefining product photography',
    summary: 'Reimagining catalogue photography to build trust at a glance.',
    href: '#',
    image: '/images/other-grocery.webp',
  },
  {
    title: 'Chocolate brand website',
    summary: 'A website for a premium chocolate brand, designed under a tight deadline.',
    href: '#',
    image: '/images/other-chocolate.webp',
  },
]
