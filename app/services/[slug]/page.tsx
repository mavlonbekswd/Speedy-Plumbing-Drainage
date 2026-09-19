// /services/<slug>. Statically generated from the published leaves and nothing else.
//
// `dynamicParams = false` is the whole point of this file: a slug that is not in the list below
// is a real 404 from Next, not a redirect and not a 200 with an empty page. An unpublished leaf
// is therefore invisible rather than half-built, which is what keeps an ad from ever landing on
// a page nobody has written.
//
// Nothing here reads anything from the request, so every page is a static file.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { PUBLISHED_SERVICES, serviceHref } from "@/lib/services";
import { SITE_URL, openGraphFor } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return PUBLISHED_SERVICES.map((service) => ({ slug: service.slug }));
}

/** Published only: a leaf that exists but is not live must not resolve here either. */
function findService(slug: string) {
  return PUBLISHED_SERVICES.find((service) => service.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};

  const path = serviceHref(service.slug);
  const { title, description } = service.meta;

  return {
    // Absolute: the leaf titles are already complete sentences and the root layout's template
    // would otherwise append the firm's name to a string that already ends with it.
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: openGraphFor({ path, title, description }),
    twitter: { card: "summary_large_image" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  return <ServicePage data={service} />;
}
