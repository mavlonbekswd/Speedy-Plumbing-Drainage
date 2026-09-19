// /blog/<slug>. Statically generated from the published posts and nothing else.
//
// `dynamicParams = false` does the same job here as it does on /services/<slug>: a slug that is
// not in the list below is a real 404 from Next rather than a 200 with an empty article.
//
// PICTURES (owner, 19 September 2026). Two of them, and they are different things:
//   - a HeroBackdrop behind the first screen, keyed per post in components/blog/postMedia.ts.
//     Generated, decorative, no alt, no caption, never presented as our work.
//   - one or two of OUR OWN job photographs inside the body, from lib/media.ts, with the alt and
//     the caption that file gives them. Those are the honest answer to "too text heavy".
// The AI-generated header images the old site used are still deleted and are not coming back.
//
// `params` is a Promise in Next 15 and is awaited. Nothing else is read from the request.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import StaticHero from "@/components/static/StaticHero";
import JsonLd from "@/components/JsonLd";
import PostBody from "@/components/blog/PostBody";
import { heroForPost } from "@/components/blog/postMedia";
import { DEFAULT_CTA_BAND, PRICE_PROCESS_LINE } from "@/lib/claims";
import { PUBLISHED_POSTS, blogHref, type BlogPost } from "@/lib/blog";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import { SITE_URL, TRADING_NAME, CONTENT_LAST_MODIFIED, openGraphFor } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return PUBLISHED_POSTS.map((post) => ({ slug: post.slug }));
}

/** Published only: a leaf that exists but is not live must not resolve here either. */
function findPost(slug: string): BlogPost | undefined {
  return PUBLISHED_POSTS.find((post) => post.slug === slug);
}

/** The index is only offered as a crumb when it is live, so no crumb is ever a 404. */
const blogIndexHref = STATIC_ROUTE_BY_PATH["/blog"]?.published ? "/blog" : undefined;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};

  const path = blogHref(post.slug);
  const title = `${post.title} | ${TRADING_NAME}`;

  return {
    title: { absolute: title },
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: openGraphFor({ path, title, description: post.excerpt }),
    twitter: { card: "summary_large_image" },
  };
}

function readableDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  // author is the organisation. There is no by-line because there is no named writer, and a
  // person invented for a schema block is a fabricated fact like any other.
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: CONTENT_LAST_MODIFIED,
    inLanguage: "en-GB",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${blogHref(post.slug)}` },
    author: { "@type": "Organization", name: TRADING_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: TRADING_NAME, url: SITE_URL },
  };

  return (
    <div className="has-callbar">
      <JsonLd data={article} id="article-schema" />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <article>
          {/* The post's date and reading time ARE its eyebrow: a blog post is the one page here
              whose H1 is a title rather than a sentence, so the label above it is the stamp. */}
          <StaticHero
            image={heroForPost(post.slug)}
            crumbs={
              <Breadcrumb
                items={[{ name: "Home", href: "/" }, { name: "Advice", href: blogIndexHref }, { name: post.title }]}
              />
            }
            eyebrow={
              <>
                <span className="nums">{readableDate(post.date)}</span>
                {post.readingTime ? ` · ${post.readingTime}` : ""}
              </>
            }
            h1={post.title}
            sub={post.excerpt || undefined}
            ctaLocation="blog_post_hero"
          />

          <section className="border-t border-line bg-paper-2">
            <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
              <PostBody slug={post.slug} body={post.body} />

              <p className="mt-10 max-w-[66ch] text-[16px] leading-[1.7] text-slate">{PRICE_PROCESS_LINE}</p>
            </div>
          </section>
        </article>

        <CTABand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
