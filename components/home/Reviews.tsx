import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { HAS_REVIEWS } from "@/lib/claims";
import { FEATURED_PHOTO_SLUGS, PHOTO_BY_SLUG } from "@/lib/media";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import { GOOGLE_PROFILE_URL } from "@/lib/site";

// The reviews block, moved onto the home page on 19 September 2026 when /reviews was removed.
// /reviews now redirects here, which is why the id is `reviews` and not something prettier.
//
// WHAT THIS SECTION MAY NOT DO, and the reason, so nobody adds it back later:
// there are four Google reviews, which is below the floor at which a number means anything. So
// no count, no score, no stars drawn or written, no quoted or paraphrased customer, no names,
// and no `Review` or `aggregateRating` schema anywhere near it. lib/claims.ts bans the wording
// and tests/seo.spec.ts bans the schema; this comment is the third lock, on the intent.
//
// The branch is driven by HAS_REVIEWS rather than by the copy, exactly as the removed page did,
// so the day the reviews clear the floor the unit that adds them fills the other arm.
//
// What stands here instead is the honest answer, how we ask, and three photographs of our own
// work, because a picture of a finished job is the one thing we can show today that is ours.
const PHOTOS = FEATURED_PHOTO_SLUGS.slice(0, 3)
  .map((slug) => PHOTO_BY_SLUG[slug])
  .filter((photo) => Boolean(photo) && !photo.illustration);

export default function Reviews() {
  const projectsPublished = STATIC_ROUTE_BY_PATH["/projects"]?.published === true;

  return (
    <section id="reviews" className="bg-paper">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <AnimateIn>
            <SectionHeading eyebrow="Reviews" title="Our reviews live on our Google profile." />

            {HAS_REVIEWS ? null : (
              <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.7] text-slate">
                We do not reprint them here. We ask every customer to leave one, we offer nothing in return, and
                we filter nothing out.
              </p>
            )}

            {GOOGLE_PROFILE_URL !== "" && (
              <a
                href={GOOGLE_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="nav"
                data-cta-location="home_reviews"
                data-cta-variant="secondary_button"
                className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-chip border border-line bg-white px-4 text-[15px] font-semibold text-brand hover:border-tint"
              >
                Read our reviews on Google <ArrowRight size={15} weight="bold" aria-hidden />
              </a>
            )}

            {/* Only when the page behind it is live: a link to an unpublished route is a 404. */}
            {projectsPublished && (
              <a
                href="/projects"
                data-cta="nav"
                data-cta-location="home_reviews"
                data-cta-variant="text_link"
                className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-bold text-tint hover:underline hover:underline-offset-4"
              >
                See more of our own jobs <ArrowRight size={15} weight="bold" aria-hidden />
              </a>
            )}
          </AnimateIn>

          <AnimateIn delay={120}>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {PHOTOS.map((photo) => (
                <figure key={photo.slug} className="m-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line bg-paper-2">
                    <Image
                      src={photo.file}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 767px) 33vw, 20vw"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 text-[13px] leading-snug text-slate">{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
