import { MapPin } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema } from '../lib/schema'
import { projects, projectsArePlaceholders } from '../data/projects'
import PageHero from '../components/layout/PageHero'
import ComparisonSlider from '../components/ui/ComparisonSlider'
import Reveal from '../components/ui/Reveal'

export default function Projects() {
  return (
    <>
      <Seo
        title="Projects — Before & After"
        description="Recent plumbing and drainage projects across Cambridge and surrounding areas — before and after comparisons with details of the work completed."
        path="/projects"
        jsonLd={[breadcrumbSchema([{ name: 'Projects', path: '/projects' }])]}
      />

      <PageHero
        eyebrow="Our work"
        title="Before. After. Proof."
        intro={
          projectsArePlaceholders
            ? 'The projects below show the gallery format with placeholder imagery — genuine completed jobs (with customer permission) replace them as they are documented.'
            : 'Recent jobs across Cambridge and the surrounding areas.'
        }
        crumbs={[{ name: 'Projects', path: '/projects' }]}
      />

      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl space-y-28 md:space-y-40">
          {projects.map((project) => (
            <Reveal key={project.slug}>
              <article aria-labelledby={`project-${project.slug}`}>
                <ComparisonSlider
                  before={project.before}
                  after={project.after}
                  beforeAlt={project.beforeAlt}
                  afterAlt={project.afterAlt}
                />
                <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 id={`project-${project.slug}`} className="display-md">
                      {project.title}
                    </h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-steel-dark">
                      <MapPin className="size-4 text-blue" aria-hidden="true" />
                      {project.location} · {project.service} · {project.completedIn}
                    </p>
                    {projectsArePlaceholders && (
                      <p className="mt-2 text-xs tracking-wide text-steel-dark/70 uppercase">
                        Placeholder project
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
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
