import {
  ANSWERED_LINE,
  ARRIVAL_LINE,
  AVAILABILITY_LINE,
  COVERAGE_LINE,
  EXPERIENCE_LINE,
  FREE_WHATSAPP_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  NIGHT_RATE_LINE,
  OUT_OF_SCOPE_SENTENCE,
  PRICE_NOTE,
  PRICE_PROCESS_LINE,
  SMALL_JOBS_LINE,
} from "@/lib/claims";
import { PUBLISHED_SERVICES, serviceHref } from "@/lib/services";
import { COUNTY_ORDER, TIER1, TOWNS_BY_COUNTY, townHref } from "@/lib/towns";
import {
  CALL_NUMBER_DISPLAY,
  CALL_NUMBER_E164,
  CONTACT_EMAIL,
  FOOTER_LEGAL_LINE,
  SITE_URL,
  TRADING_NAME,
  WHATSAPP_URL,
} from "@/lib/site";

// A plain-text brief for a model that is answering a question about this business, served at
// /llms.txt on the canonical www origin.
//
// Two rules make it safe to publish. Every sentence in it is a lib/claims.ts constant, so it
// cannot say anything the site is not already allowed to say and cannot drift from the pages
// when a claim changes. And there is no price in it, present or absent, because the business
// has no fee to quote and a model that invented one would be quoting on its behalf.
//
// Static: nothing here reads a request, so it is generated at build time and served from the
// edge cache like any other file.
export const dynamic = "force-static";

function absolute(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function build(): string {
  const lines: string[] = [];

  lines.push(`# ${TRADING_NAME}`);
  lines.push("");
  lines.push(`> Plumbing and drainage across ${COVERAGE_LINE} ${AVAILABILITY_LINE}`);
  lines.push("");

  lines.push("## Contact");
  lines.push(`- Website: ${SITE_URL}`);
  lines.push(`- Phone: ${CALL_NUMBER_DISPLAY} (${CALL_NUMBER_E164})`);
  lines.push(`- WhatsApp: ${WHATSAPP_URL}`);
  lines.push(`- Email: ${CONTACT_EMAIL}`);
  lines.push("");

  lines.push("## Company");
  // The one constant the footer of every page renders, rather than four bullets restating it.
  lines.push(FOOTER_LEGAL_LINE);
  lines.push("");

  lines.push("## What is true of every job");
  for (const claim of [
    AVAILABILITY_LINE,
    ANSWERED_LINE,
    ARRIVAL_LINE,
    PRICE_PROCESS_LINE,
    NIGHT_RATE_LINE,
    `${GUARANTEE_LINE} ${GUARANTEE_SCOPE_LINE}`,
    INSURED_LEAD,
    EXPERIENCE_LINE,
    SMALL_JOBS_LINE,
    FREE_WHATSAPP_LINE,
  ]) {
    lines.push(`- ${claim}`);
  }
  lines.push("");
  // The whole of the pricing position, in the words the pages use. Nothing is paraphrased
  // here: a model quoting a figure on the firm's behalf is the failure this file exists to
  // avoid, and a paraphrase is how one gets invented.
  lines.push(PRICE_NOTE);
  lines.push("");

  lines.push("## Where we work");
  lines.push(COVERAGE_LINE);
  lines.push("");

  if (PUBLISHED_SERVICES.length > 0) {
    lines.push("## Services");
    for (const service of PUBLISHED_SERVICES) {
      lines.push(`- ${service.navLabel}: ${absolute(serviceHref(service.slug))}`);
    }
    lines.push("");
  }

  const publishedTier1 = TIER1.filter((town) => town.published);
  if (publishedTier1.length > 0) {
    lines.push("## Towns with their own page");
    for (const county of COUNTY_ORDER) {
      const towns = TOWNS_BY_COUNTY[county];
      if (towns.length === 0) continue;
      lines.push(`### ${county}`);
      for (const town of towns) {
        lines.push(`- ${town.name}: ${absolute(townHref(town.slug))}`);
      }
    }
    lines.push("");
  }

  lines.push("## Work we do not take on");
  lines.push(OUT_OF_SCOPE_SENTENCE);
  lines.push("");

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
