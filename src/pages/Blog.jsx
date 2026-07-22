import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema } from '../lib/schema'
import { blogPosts } from '../data/blogPosts'
import PageHero from '../components/layout/PageHero'
import ResponsiveImage from '../components/ui/ResponsiveImage'
import Reveal from '../components/ui/Reveal'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Blog() {
  return (
    <>
      <Seo
        title="Advice & Blog"
        description="Practical plumbing and drainage advice from a working Cambridge plumber — emergencies, recurring blockages, hidden leaks and more."
        path="/blog"
        jsonLd={[breadcrumbSchema([{ name: 'Blog', path: '/blog' }])]}
      />

      <PageHero
        eyebrow="Advice & blog"
        title="Practical advice from the tools."
        intro="What to do in an emergency, how to spot problems early, and when to call a professional — written from real jobs, not theory."
        crumbs={[{ name: 'Blog', path: '/blog' }]}
      />

      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={0.06 * i}>
                <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-charcoal/10 bg-white">
                  <Link to={`/blog/${post.slug}`} className="block overflow-hidden" aria-hidden="true" tabIndex={-1}>
                    <ResponsiveImage
                      image={post.image}
                      sizes="(min-width: 1280px) 410px, (min-width: 768px) calc(33vw - 2rem), calc(100vw - 2.5rem)"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="flex items-center gap-3 text-xs font-medium tracking-wide text-steel-dark uppercase">
                      {formatDate(post.date)}
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" aria-hidden="true" />
                        {post.readingTime}
                      </span>
                    </p>
                    <h2 className="mt-4 text-xl leading-snug font-bold">
                      <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-blue">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-dark">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-blue uppercase underline-offset-4 hover:underline"
                    >
                      Read article
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
