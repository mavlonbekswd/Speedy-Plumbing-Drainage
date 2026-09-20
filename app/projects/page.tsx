// /projects. Real jobs or the page does not exist.
//
// Every tile comes from lib/media.ts, and the captions are used EXACTLY as that file writes
// them: they are claims-reviewed, and a town, a brand, a date, a time or a price added here
// would be a claim nobody has evidence for. The gallery reads JOB_PHOTOS, which already has the
// AI-made brand graphic filtered out; a drawing in a gallery of real jobs is the one thing this
// page exists to avoid. For the same reason NOTHING from ILLUSTRATIONS ever appears here.
//
// The one generated picture on the page is the HeroBackdrop behind the first screen, drawn by
// the shared components/static/StaticHero.tsx. It is decoration at 50% opacity with no alt and
// no caption, it sits above the sentence that says every photo and clip BELOW is ours, and it is
// never presented as work.
//
// Nothing is sliced, capped or featured: all 23 JOB_PHOTOS and all 6 WORK_VIDEOS render, grouped
// by their own `group` value. GROUPS below covers every MediaGroup except "brand", which only
// the illustration uses and which JOB_PHOTOS has already removed.
//
// This page carries NO price-process line: tests/excluded-copy.spec.ts holds /projects and
// /privacy out of that rule, and a booking form would put the line back through its own sub.
// The call bar and the Call and WhatsApp buttons do render, because a visitor who is convinced
// by a photograph should not have to scroll back up to find the number.
//
// Static: nothing is read from the request.

import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import StaticHero from "@/components/static/StaticHero";
import WorkVideo from "@/components/WorkVideo";
import AnimateIn from "@/components/AnimateIn";
import ZoomableImage from "@/components/ZoomableImage";
import { DEFAULT_CTA_BAND } from "@/lib/claims";
import { FALLBACK_HERO, JOB_PHOTOS, WORK_VIDEOS } from "@/lib/media";
import type { MediaGroup } from "@/lib/types";
import { SITE_URL, TRADING_NAME, openGraphFor } from "@/lib/site";

const TITLE = `Recent work | ${TRADING_NAME}`;
const DESCRIPTION =
  "Photographs and short clips of jobs our own plumbers have done: bathrooms, taps, toilets, leaks and pipework, drains, hot water cylinders, pumps and valves.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: openGraphFor({ path: "/projects", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** Plain labels, in the order a visitor scans them. A group with no photos is skipped. */
const GROUPS: { group: MediaGroup; label: string }[] = [
  { group: "bathroom", label: "Bathrooms" },
  { group: "taps", label: "Taps" },
  { group: "toilets", label: "Toilets" },
  { group: "leaks", label: "Leaks and pipework" },
  { group: "drains", label: "Drains" },
  { group: "hot-water", label: "Hot water" },
  { group: "heating-parts", label: "Pumps and valves" },
  { group: "supply", label: "Water supply" },
];

const CLIPS_ID = "group-clips";

/** Two up on a phone, three on a tablet, four on a desktop. Same grid for photos and clips. */
const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4";

/** The header is sticky, so an anchored heading needs clearance above it. */
const ANCHOR = "scroll-mt-24";

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      data-cta="nav"
      data-cta-location="projects_groups"
      data-cta-variant="chip"
      className="press inline-flex min-h-[44px] items-center rounded-chip border border-line bg-white px-4 text-[15px] font-semibold text-brand hover:border-tint"
    >
      {children}
    </a>
  );
}

function GroupHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className={`${ANCHOR} font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] text-brand`}
    >
      {children}
    </h2>
  );
}

export default function ProjectsPage() {
  // Rendered once and reused by the chip row, so a group can never be linked but not shown.
  const groups = GROUPS.map((entry) => ({
    ...entry,
    photos: JOB_PHOTOS.filter((photo) => photo.group === entry.group),
  })).filter((entry) => entry.photos.length > 0);

  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* No `facts`: /projects is one of the two routes tests/excluded-copy.spec.ts holds the
            price-process line OFF, and the shared hero only prints facts it is given. */}
        <StaticHero
          image={FALLBACK_HERO}
          crumbs={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Recent work" }]} />}
          eyebrow="Our own jobs"
          h1="Recent work."
          sub="Every photo and clip on this page is from our own jobs."
          ctaLocation="projects_hero"
        />

        {/* Jump list. Plain anchors, no client state: it works before any script runs. */}
        <nav aria-label="Jump to a kind of job" className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-10 sm:px-8 md:py-12">
            <div className="flex flex-wrap gap-2">
              <Chip href={`#${CLIPS_ID}`}>Clips</Chip>
              {groups.map(({ group, label }) => (
                <Chip key={group} href={`#group-${group}`}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        </nav>

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
            <GroupHeading id={CLIPS_ID}>Clips</GroupHeading>

            <div className={`mt-6 ${GRID}`}>
              {WORK_VIDEOS.map((video, i) => (
                <AnimateIn key={video.slug} delay={i * 60}>
                  <WorkVideo slug={video.slug} />
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto flex max-w-content flex-col gap-12 px-5 py-14 sm:px-8 md:gap-16 md:py-20">
            {groups.map(({ group, label, photos }) => (
              <div key={group}>
                <GroupHeading id={`group-${group}`}>{label}</GroupHeading>

                <div className={`mt-6 ${GRID}`}>
                  {photos.map((photo, i) => (
                    <AnimateIn key={photo.slug} delay={i * 60}>
                      <figure className="m-0">
                        {/* Photographs enlarge; the clips above do not, because a clip already
                            has its own play control inside components/WorkVideo.tsx. */}
                        <ZoomableImage
                          src={photo.file}
                          alt={photo.alt}
                          caption={photo.caption}
                          location="projects"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line bg-paper">
                            <Image
                              src={photo.file}
                              alt={photo.alt}
                              width={photo.width}
                              height={photo.height}
                              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </ZoomableImage>
                        <figcaption className="mt-2 text-[13.5px] leading-snug text-slate">
                          {photo.caption}
                        </figcaption>
                      </figure>
                    </AnimateIn>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <CTABand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
