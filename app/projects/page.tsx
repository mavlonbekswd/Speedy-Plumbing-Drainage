// /projects. Real jobs or the page does not exist.
//
// Every tile comes from lib/media.ts, and the captions are used EXACTLY as that file writes
// them: they are claims-reviewed, and a town, a brand, a date, a time or a price added here
// would be a claim nobody has evidence for. The gallery reads JOB_PHOTOS, which already has the
// AI-made brand graphic filtered out; a drawing in a gallery of real jobs is the one thing this
// page exists to avoid.
//
// This page carries NO price-process line: tests/excluded-copy.spec.ts holds /projects and
// /privacy out of that rule, and a booking form would put the line back through its own sub.
// The call bar and the Call and WhatsApp buttons do render, because a visitor who is convinced
// by a photograph should not have to scroll back up to find the number.
//
// Static: nothing is read from the request.

import type { Metadata } from "next";
import Image from "next/image";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import WorkVideo from "@/components/WorkVideo";
import AnimateIn from "@/components/AnimateIn";
import Button from "@/components/ui/Button";
import { DEFAULT_CTA_BAND } from "@/lib/claims";
import { JOB_PHOTOS, WORK_VIDEOS } from "@/lib/media";
import type { MediaGroup } from "@/lib/types";
import { CALL_HREF, CALL_NUMBER_DISPLAY, SITE_URL, TRADING_NAME, WHATSAPP_URL, openGraphFor } from "@/lib/site";

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

export default function ProjectsPage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-12 pt-8 sm:px-8 lg:px-12 md:pb-16 md:pt-10">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Recent work" }]} className="mb-8" />

            <h1 className="max-w-[16ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Recent work.
            </h1>

            <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-slate">
              These are our plumbers&apos; own jobs, photographed on site.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="xl"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="projects"
                data-cta-variant="primary_button"
              >
                <Phone size={20} weight="fill" aria-hidden />
                Call {CALL_NUMBER_DISPLAY}
              </Button>
              <Button
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="xl"
                className="w-full sm:w-auto"
                data-cta="whatsapp"
                data-cta-location="projects"
                data-cta-variant="secondary_button"
              >
                <WhatsappLogo size={22} weight="fill" aria-hidden />
                WhatsApp us
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto flex max-w-content flex-col gap-14 px-5 py-16 sm:px-8 md:gap-20 md:py-24">
            {GROUPS.map(({ group, label }) => {
              const photos = JOB_PHOTOS.filter((photo) => photo.group === group);
              if (photos.length === 0) return null;

              return (
                <div key={group}>
                  <h2 className="font-display text-[clamp(24px,2.8vw,34px)] font-extrabold leading-[1.05] text-brand">
                    {label}
                  </h2>

                  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {photos.map((photo, i) => (
                      <AnimateIn key={photo.slug} delay={i * 60}>
                        <figure className="m-0">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line bg-paper">
                            <Image
                              src={photo.file}
                              alt={photo.alt}
                              width={photo.width}
                              height={photo.height}
                              sizes="(max-width: 767px) 50vw, 33vw"
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <figcaption className="mt-2 text-[13.5px] leading-snug text-slate">
                            {photo.caption}
                          </figcaption>
                        </figure>
                      </AnimateIn>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-24">
            <h2 className="font-display text-[clamp(24px,2.8vw,34px)] font-extrabold leading-[1.05] text-brand">
              Short clips from the job
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {WORK_VIDEOS.map((video, i) => (
                <AnimateIn key={video.slug} delay={i * 60}>
                  <WorkVideo slug={video.slug} />
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <CTABand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
