import { featured, others } from '../data'
import ArrowIcon from './ArrowIcon'
import ProjectCard from './ProjectCard'

export default function Projects() {
  return (
    <section className="animate-fade-up [animation-delay:150ms]">
      <div className="flex flex-col gap-24 sm:gap-32">
        {featured.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      <h2 className="label mt-24 mb-4 sm:mt-28">other projects</h2>
      <div className="grid gap-12 sm:grid-cols-2 sm:gap-6">
        {others.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group block"
          >
            <div className="rounded-[22px] bg-white/50 p-1.5 ring-1 ring-black/[0.05]">
              <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
                <img
                  src={project.image}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <h3 className="max-w-[16ch] text-[20px] leading-[1.15] font-medium tracking-[-0.02em]">
                {project.title}
              </h3>
              <ArrowIcon />
            </div>
            <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-muted">
              {project.summary}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
