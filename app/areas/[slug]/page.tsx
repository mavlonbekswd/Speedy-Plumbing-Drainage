// /areas/<slug>. Statically generated from the published towns and nothing else.
//
// `dynamicParams = false` makes an unknown or unpublished town a real 404 from Next rather than
// a redirect or a thin 200. Eleven town keywords run against these URLs, so a page that answers
// with anything other than the town it was asked for is a wasted click at best.
//
// Nothing here reads anything from the request, so every page is a static file.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TownPage from "@/components/TownPage";
import { ARRIVAL_LINE, AVAILABILITY_LINE } from "@/lib/claims";
import { SERVICE_BY_SLUG } from "@/lib/services";
import { placeOf, PUBLISHED_TOWNS, townHref } from "@/lib/towns";
import { SITE_URL, TRADING_NAME, openGraphFor } from "@/lib/site";
import type { City } from "@/lib/types";

/** Every town page is the emergency page written for one town. */
const LEAD = SERVICE_BY_SLUG["emergency-plumbing"];

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return PUBLISHED_TOWNS.map((town) => ({ slug: town.slug }));
}

/** Published only: a skeleton leaf that exists but is not live must not resolve here either. */
function findTown(slug: string): City | undefined {
  return PUBLISHED_TOWNS.find((town) => town.slug === slug);
}

/** Distinct per town by construction, and it always names the town. */
function titleFor(city: City): string {
  return city.metaTitle ?? `Emergency Plumber ${city.name} | 24/7 | ${TRADING_NAME}`;
}

/**
 * The town's own blurb where it has one. Where it does not, the description is assembled from
 * the shared claim constants with the town written in, so it still says something true and
 * still differs from every other town's.
 */
function descriptionFor(city: City): string {
  const blurb = city.blurb.trim();
  if (blurb) return blurb;
  return `Emergency plumber in ${placeOf(city)}, ${city.county}. ${ARRIVAL_LINE} ${AVAILABILITY_LINE}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = findTown(slug);
  if (!city) return {};

  const path = townHref(city.slug);
  const title = titleFor(city);
  const description = descriptionFor(city);

  return {
    // Absolute: the title is already complete and the root layout's template would otherwise
    // append the firm's name a second time.
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: openGraphFor({ path, title, description }),
    twitter: { card: "summary_large_image" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = findTown(slug);
  // The town H1 comes from the emergency leaf, so a town page without it would have no headline.
  if (!city || !LEAD.published || !LEAD.townH1) notFound();

  return <TownPage city={city} lead={LEAD} />;
}
