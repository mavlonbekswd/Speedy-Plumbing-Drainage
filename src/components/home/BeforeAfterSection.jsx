import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { projects, projectsArePlaceholders } from '../../data/projects'
import ComparisonSlider from '../ui/ComparisonSlider'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function BeforeAfterSection() {
  const project = projects[0]

  return (
    <section className="bg-mist px-5 py-28 text-charcoal md:px-8 md:py-40" aria-labelledby="beforeafter-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The difference"
          title={<span id="beforeafter-heading">Before. After. Done properly.</span>}
          intro="Drag the slider to compare. Every job ends with a working system and a clean site — that’s the standard."
          dark={false}
        />

        <Reveal className="mt-16">
          <ComparisonSlider
            before={project.before}
            after={project.after}
            beforeAlt={project.beforeAlt}
            afterAlt={project.afterAlt}
          />
        </Reveal>

        <Reveal className="mt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="display-md">{project.title}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-steel-dark">
                <MapPin className="size-4 text-blue" aria-hidden="true" />
                {project.location} · {project.service} · {project.completedIn}
              </p>
              {projectsArePlaceholders && (
                <p className="mt-2 text-xs tracking-wide text-steel-dark/70 uppercase">
                  Placeholder project — replaced with genuine completed jobs
                </p>
              )}
            </div>
            <ul className="grid gap-2 text-sm text-charcoal/80 sm:grid-cols-2 md:max-w-md">
              {project.workCompleted.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-blue uppercase underline-offset-4 hover:underline"
          >
            View more projects
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
