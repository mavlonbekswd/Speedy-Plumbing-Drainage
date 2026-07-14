import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { businessConfig } from '../../data/business'
import { footerAreaSlugs, getAreaBySlug, locationPageSlugs } from '../../data/serviceAreas'
import { services } from '../../data/services'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()
  const keyAreas = footerAreaSlugs.map(getAreaBySlug)

  return (
    <footer className="border-t border-white/8 bg-navy-deep pb-28 lg:pb-12">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + contact */}
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel">
              Professional plumbing and drainage services across Cambridge and surrounding areas.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href={businessConfig.phoneHref}
                className="flex items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-electric"
              >
                <Phone className="size-4 text-electric" aria-hidden="true" />
                {businessConfig.phoneDisplay}
              </a>
              <a
                href={businessConfig.emailHref}
                className="flex items-center gap-3 text-sm text-mist/80 transition-colors hover:text-electric"
              >
                <Mail className="size-4 text-electric" aria-hidden="true" />
                {businessConfig.email}
              </a>
            </div>
            {businessConfig.socialLinks.length > 0 && (
              <ul className="mt-6 flex gap-4">
                {businessConfig.socialLinks.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-steel hover:text-electric">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h2 className="eyebrow text-electric">Services</h2>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-sm text-mist/75 transition-colors hover:text-white"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Key areas */}
          <nav aria-label="Areas we cover">
            <h2 className="eyebrow text-electric">Areas We Cover</h2>
            <ul className="mt-5 space-y-2.5">
              {keyAreas.map((a) => (
                <li key={a.slug}>
                  {locationPageSlugs.includes(a.slug) ? (
                    <Link
                      to={`/areas/${a.slug}`}
                      className="text-sm text-mist/75 transition-colors hover:text-white"
                    >
                      Plumber in {a.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-mist/75">{a.name}</span>
                  )}
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/areas-we-cover"
                  className="text-sm font-semibold text-electric underline-offset-4 hover:underline"
                >
                  View all areas we cover →
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h2 className="eyebrow text-electric">Company</h2>
            <ul className="mt-5 space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/projects', label: 'Projects' },
                { to: '/reviews', label: 'Reviews' },
                { to: '/faqs', label: 'FAQs' },
                { to: '/blog', label: 'Advice & Blog' },
                { to: '/contact', label: 'Contact' },
                { to: '/quote', label: 'Request a Quote' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-mist/75 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/8 pt-6 text-xs text-steel/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {businessConfig.name}. Serving homes and businesses throughout Cambridgeshire and
            nearby towns.
          </p>
          <p>
            <a href={businessConfig.phoneHref} className="hover:text-white">
              {businessConfig.phoneDisplay}
            </a>
            <span className="mx-2">·</span>
            <a href={businessConfig.emailHref} className="hover:text-white">
              {businessConfig.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
