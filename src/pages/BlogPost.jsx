import { Link, Navigate, useParams } from 'react-router-dom'
import { Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { blogPosts, getPostBySlug } from '../data/blogPosts'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  const others = blogPosts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        jsonLd={[
          breadcrumbSchema([
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={`${formatDate(post.date)} · ${post.readingTime}`}
        title={post.title}
        intro={post.excerpt}
        image={post.image}
        crumbs={[
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <article className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-3xl">
          {post.body.map((section) => (
            <Reveal key={section.h}>
              <section className="mb-12">
                <h2 className="display-md">{section.h}</h2>
                <p className="mt-5 text-lg leading-relaxed text-charcoal/85">{section.p}</p>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <div className="mt-4 flex flex-col items-start gap-5 rounded-sm bg-charcoal p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="display-md text-white">Dealing with this right now?</p>
                <p className="mt-2 text-steel">Serving Cambridge and the surrounding areas.</p>
              </div>
              <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
                {businessConfig.phoneDisplay}
              </Button>
            </div>
          </Reveal>

          {others.length > 0 && (
            <nav aria-label="More articles" className="mt-16 border-t border-charcoal/10 pt-10">
              <h2 className="eyebrow text-blue">More advice</h2>
              <ul className="mt-5 space-y-3">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to={`/blog/${p.slug}`}
                      className="text-lg font-semibold text-charcoal underline-offset-4 transition-colors hover:text-blue hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </article>
    </>
  )
}
