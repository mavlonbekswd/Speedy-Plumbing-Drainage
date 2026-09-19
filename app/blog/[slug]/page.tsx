// /blog/<slug>. Statically generated from the published posts and nothing else.
//
// `dynamicParams = false` does the same job here as it does on /services/<slug>: a slug that is
// not in the list below is a real 404 from Next rather than a 200 with an empty article. All
// three leaves are unpublished today, so the list is empty and the route serves nothing, which
// is the correct behaviour and not a bug.
//
// TEXT ONLY. The old posts carried AI-generated header images; those files are deleted and no
// image goes back on a blog page.
//
// `params` is a Promise in Next 15 and is awaited. Nothing else is read from the request.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import Button from "@/components/ui/Button";
import { DEFAULT_CTA_BAND, PRICE_PROCESS_LINE } from "@/lib/claims";
import { PUBLISHED_POSTS, blogHref, type BlogPost } from "@/lib/blog";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  SITE_URL,
  TRADING_NAME,
  CONTENT_LAST_MODIFIED,
  openGraphFor,
} from "@/lib/site";

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

/** A section's `p` holds its paragraphs separated by a blank line, so each stays its own <p>. */
function paragraphsOf(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
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
          <section className="bg-paper">
            <div className="mx-auto max-w-content px-5 pb-10 pt-8 sm:px-8 lg:px-12 md:pb-14 md:pt-10">
              <Breadcrumb
                items={[{ name: "Home", href: "/" }, { name: "Advice", href: blogIndexHref }, { name: post.title }]}
                className="mb-8"
              />

              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
                <span className="nums">{readableDate(post.date)}</span>
                {post.readingTime ? ` · ${post.readingTime}` : ""}
              </p>

              <h1 className="max-w-[20ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-slate">{post.excerpt}</p>
              )}

              <div className="mt-8">
                <Button
                  as="a"
                  href={CALL_HREF}
                  variant="primary"
                  size="xl"
                  className="nums w-full sm:w-auto"
                  data-cta="phone"
                  data-cta-location="blog"
                  data-cta-variant="primary_button"
                >
                  <Phone size={20} weight="fill" aria-hidden />
                  Call {CALL_NUMBER_DISPLAY}
                </Button>
              </div>
            </div>
          </section>

          <section className="border-t border-line bg-paper-2">
            <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-24">
              <div className="flex max-w-[66ch] flex-col gap-10">
                {post.body.map((block) => (
                  <div key={block.h} className="flex flex-col gap-4">
                    <h2 className="font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] text-brand">
                      {block.h}
                    </h2>
                    {paragraphsOf(block.p).map((paragraph) => (
                      <p key={paragraph} className="text-[16.5px] leading-[1.75] text-slate">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}

                <p className="text-[16px] leading-[1.7] text-slate">{PRICE_PROCESS_LINE}</p>
              </div>
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
