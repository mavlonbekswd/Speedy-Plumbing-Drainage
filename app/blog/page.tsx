// /blog. The index.
//
// It lists PUBLISHED posts only, from lib/blog.ts, so a post that is written but not signed off
// is invisible here and 404s at its own URL. All three leaves are unpublished today, which is
// why the empty arm below is written as carefully as the list: an index that says "coming soon"
// and shows nothing is worse than one that says plainly there is nothing yet and gives you the
// number instead.
//
// TEXT ONLY throughout the blog. The old posts' images were AI-generated and are deleted.
//
// Static: nothing is read from the request.

import type { Metadata } from "next";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import AnimateIn from "@/components/AnimateIn";
import Button from "@/components/ui/Button";
import { ANSWERED_LINE, PRICE_PROCESS_LINE } from "@/lib/claims";
import { PUBLISHED_POSTS, blogHref } from "@/lib/blog";
import { CALL_HREF, CALL_NUMBER_DISPLAY, SITE_URL, TRADING_NAME, openGraphFor } from "@/lib/site";

const TITLE = `Advice from the tools | ${TRADING_NAME}`;
const DESCRIPTION =
  "Plain plumbing advice from the people who do the work: what to do in the first five minutes, what to stop doing, and when it is time to ring a plumber.";

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
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-14 pt-8 sm:px-8 lg:px-12 md:pb-20 md:pt-10">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Advice" }]} className="mb-8" />

            <h1 className="max-w-[18ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Advice from the tools.
            </h1>

            <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-slate">
              What to do before anyone arrives, and what to leave alone. Written by the plumbers who
              go out to it.
            </p>

            <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.6] text-slate">{PRICE_PROCESS_LINE}</p>

            {/* Only the "nothing yet" paragraph is conditional. The Call button is the page's one
                primary action and stays put the day the first post publishes. */}
            {PUBLISHED_POSTS.length === 0 && (
              <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.7] text-slate">
                There is nothing to read here yet. The first pieces are being written, and until one
                is ready the quickest answer is the phone. {ANSWERED_LINE}
              </p>
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

        {PUBLISHED_POSTS.length > 0 && (
          <section className="border-t border-line bg-paper-2">
            <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-24">
              <ul className="grid gap-5 md:grid-cols-2">
                {PUBLISHED_POSTS.map((post, i) => (
                  // The animated wrapper sits INSIDE the <li>: a <div> as a direct child of a
                  // <ul> is a list-structure defect axe reports.
                  <li key={post.slug} className="list-none">
                    <AnimateIn delay={i * 70} className="h-full">
                      <article className="flex h-full flex-col gap-3 rounded-card border border-line bg-white p-6 shadow-card">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-tint">
                          <span className="nums">{readableDate(post.date)}</span>
                          {post.readingTime ? ` · ${post.readingTime}` : ""}
                        </p>
                        <h2 className="font-display text-[21px] font-bold leading-tight text-brand">
                          <a
                            href={blogHref(post.slug)}
                            data-cta="nav"
                            data-cta-location="blog"
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
