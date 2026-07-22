import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Reveal from '../ui/Reveal'
import ResponsiveImage from '../ui/ResponsiveImage'

/**
 * Shared cinematic hero for internal pages — keeps the premium visual
 * language consistent beyond the homepage.
 */
export default function PageHero({ eyebrow, title, intro, crumbs = [], image, children }) {
  return (
    <section className="grain relative overflow-hidden bg-charcoal px-5 pt-36 pb-20 md:px-8 md:pt-48 md:pb-28">
      {image && (
        <>
          <div className="absolute inset-0 opacity-40">
            <ResponsiveImage
              image={image}
              priority
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal" aria-hidden="true" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-steel">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-mist/80">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link to={crumb.path} className="transition-colors hover:text-white">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <Reveal>
            <p className="eyebrow text-electric">{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={0.08}>
          <h1 className="display-xl mt-5 max-w-5xl text-white">{title}</h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-steel">{intro}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.24}>{children}</Reveal>}
      </div>
    </section>
  )
}
