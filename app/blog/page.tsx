// /blog. The index.
//
// It lists PUBLISHED posts only, from lib/blog.ts, so a post that is written but not signed off
// is invisible here and 404s at its own URL. The empty arm is still written out, because the day
// a post is pulled the index has to say plainly that there is nothing here and give the number.
//
// The picture behind the first screen is a HeroBackdrop: generated, decorative, no alt and no
// caption. Our own job photographs live inside the posts themselves, not on this index.
//
// Static: nothing is read from the request.

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import AnimateIn from "@/components/AnimateIn";
import StaticHero from "@/components/static/StaticHero";
import { ANSWERED_LINE, PRICE_PROCESS_LINE } from "@/lib/claims";
import { PUBLISHED_POSTS, blogHref } from "@/lib/blog";
import { FALLBACK_HERO } from "@/lib/media";
import { SITE_URL, TRADING_NAME, openGraphFor } from "@/lib/site";

const TITLE = `Advice from the tools | ${TRADING_NAME}`;
const DESCRIPTION =
  "Burst pipes, drains that keep blocking, leaks you cannot see. What to do before anyone arrives, and when to stop trying and ring us.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: openGraphFor({ path: "/blog", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** en-GB, so a date reads the way a reader in Cambridge writes one. */
function readableDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function BlogIndexPage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* Only the "nothing yet" paragraph is conditional, and it goes under the buttons: the
            Call pill is the page's one primary action and stays put whether or not a post is
            live. */}
        <StaticHero
          image={FALLBACK_HERO}
          crumbs={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Advice" }]} />}
          eyebrow="Advice"
          h1="Advice from the tools."
          facts={[PRICE_PROCESS_LINE]}
          sub="What to do before anyone arrives, and what to leave alone."
          ctaLocation="blog_index_hero"
        >
          {PUBLISHED_POSTS.length === 0 && (
            <p className="max-w-[58ch] text-[16.5px] leading-[1.7] text-slate">
              There is nothing to read here yet. The quickest answer is the phone. {ANSWERED_LINE}
            </p>
          )}
        </StaticHero>

        {PUBLISHED_POSTS.length > 0 && (
          <section className="border-t border-line bg-paper-2">
            <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
              <ul className="grid gap-5 md:grid-cols-3">
                {PUBLISHED_POSTS.map((post, i) => (
                  // The animated wrapper sits INSIDE the <li>: a <div> as a direct child of a
                  // <ul> is a list-structure defect axe reports.
                  <li key={post.slug} className="list-none">
                    <AnimateIn delay={i * 70} className="h-full">
                      <article className="flex h-full flex-col gap-3 rounded-card border border-line bg-white p-6 shadow-card">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
                          <span className="nums">{readableDate(post.date)}</span>
                          {post.readingTime ? ` · ${post.readingTime}` : ""}
                        </p>
                        <h2 className="font-display text-[19px] font-bold leading-snug text-brand">
                          <a
                            href={blogHref(post.slug)}
                            data-cta="nav"
                            data-cta-location="blog_index_list"
                            data-cta-variant="text_link"
                            className="hover:underline underline-offset-4"
                          >
                            {post.title}
                          </a>
                        </h2>
                        <p className="max-w-[52ch] text-[15px] leading-[1.7] text-slate">{post.excerpt}</p>
                      </article>
                    </AnimateIn>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
