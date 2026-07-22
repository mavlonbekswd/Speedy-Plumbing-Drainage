import Seo from '../lib/seo'
import { breadcrumbSchema } from '../lib/schema'
import { projects, projectsAreIllustrative } from '../data/projects'
import PageHero from '../components/layout/PageHero'
import ComparisonSlider from '../components/ui/ComparisonSlider'
import Reveal from '../components/ui/Reveal'

export default function Projects() {
  return (
    <>
      <Seo
        title="Before & After Service Examples"
        description="Illustrative before and after plumbing and drainage comparisons showing the type of result professional repair and clearance work can achieve."
        path="/projects"
        jsonLd={[breadcrumbSchema([{ name: 'Projects', path: '/projects' }])]}
      />

      <PageHero
        eyebrow="Our work"
        title="Before. After. The difference."
        intro={
          projectsAreIllustrative
            ? 'These generated comparisons are illustrative service examples, not photographs of Speedy Plumbing & Drain customer jobs.'
            : 'Completed jobs shown with customer permission.'
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
                />
                <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 id={`project-${project.slug}`} className="display-md">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-steel-dark">{project.service}</p>
                    {project.isIllustrative && (
                      <p className="mt-2 text-xs tracking-wide text-steel-dark/70 uppercase">
                        Illustrative example
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
