"use client";

// "Check your postcode", the first question a customer asks, answered without
// a request and without a lead being created.
//
// checkPostcode comes from lib/towns.ts rather than lib/coverage.ts: only the
// towns module registers the lookup, so only that import path returns the
// nearest town alongside the district, which is what makes the link below
// possible.
//
// The answer for a district we do not cover is the honest one. Somebody outside
// the footprint is better served by being told so and given a number to ring
// than by "your area may still be covered", which wastes their evening.
//
// PRIVACY: the event carries the district and never the postcode the visitor
// typed. A full postcode identifies a household.

import { useId, useState } from "react";
import Link from "next/link";
import { checkPostcode, type PostcodeCheck as PostcodeVerdict, type TownRef } from "@/lib/coverage";
import { normalizePostcode, sanitizePostcodeInput } from "@/lib/postcode";
import { trackEvent } from "@/lib/analytics";
import { CALL_HREF, CALL_NUMBER_DISPLAY } from "@/lib/site";
import { FIELD_CLASS, LABEL_CLASS } from "@/components/FormStatus";
import Button from "@/components/ui/Button";

export interface PostcodeCheckProps {
  /** `dark` sits the card on a brand band; `light` is the default white card. */
  variant?: "light" | "dark";
  /** District to nearest published town, computed on the server by components/PostcodeCheck.tsx. */
  townByDistrict: Readonly<Record<string, TownRef>>;
}

export default function PostcodeCheckClient({ variant = "light", townByDistrict }: PostcodeCheckProps) {
  const [value, setValue] = useState("");
  const [verdict, setVerdict] = useState<PostcodeVerdict | null>(null);
  // Two of these cards can share a page, and a duplicated id fails axe.
  const inputId = `postcode-check-${useId()}`;

  const dark = variant === "dark";

  function check(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // lib/coverage answers the district; the town comes from the small map the server passed
    // down, so the full towns dataset never ships to the browser.
    const base = checkPostcode(value);
    const town = base.district ? townByDistrict[base.district] : undefined;
    const result: PostcodeVerdict = town ? { ...base, town } : base;
    setVerdict(result);

    trackEvent("postcode_check", {
      result: result.status,
      ...(result.district ? { district: result.district } : {}),
    });

    if (result.status === "covered") {
      // Saves the customer typing it twice. The booking form is uncontrolled
      // precisely so this write survives. Only a full postcode is copied: a bare
      // district such as "CB1" is enough to answer "do you cover me" but would
      // fail the booking form's own validation, so it is left for them to type.
      const full = normalizePostcode(value);
      const target = document.getElementById("f-postcode");
      if (full && target instanceof HTMLInputElement) target.value = full;
    }
  }

  const cardClass = dark
    ? "rounded-card border border-white/20 bg-white/10 p-5 shadow-dark sm:p-6"
    : "rounded-card border border-line bg-white p-5 shadow-card sm:p-6";
  const labelClass = dark ? "text-[14px] font-semibold text-white" : LABEL_CLASS;
  const bodyClass = dark ? "text-[15.5px] leading-[1.6] text-white" : "text-[15.5px] leading-[1.6] text-slate";
  const linkClass = dark
    ? "font-bold text-white underline underline-offset-4"
    : "font-bold text-brand underline underline-offset-4";

  return (
    <div data-postcode-check className={cardClass}>
      <form onSubmit={check} className="flex flex-col gap-2">
        <label htmlFor={inputId} className={labelClass}>
          Check your postcode
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={inputId}
            name="postcode-check"
            type="text"
            autoComplete="postal-code"
            maxLength={8}
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(sanitizePostcodeInput(e.target.value))}
            className={`${FIELD_CLASS} sm:flex-1`}
          />
          {/* No data-cta: a coverage check is not a call to action, and counting it as one
              would inflate every CTA rate on the page. */}
          <Button type="submit" size="lg">
            Check
          </Button>
        </div>
      </form>

      <div aria-live="polite" className={verdict ? "mt-4 flex flex-col gap-2" : ""}>
        {verdict?.status === "covered" && (
          <>
            <p className={bodyClass}>Yes, we cover {verdict.district}.</p>
            {verdict.town && (
              <p className={bodyClass}>
                <Link href={`/areas/${verdict.town.slug}`} className={linkClass}>
                  Plumber in {verdict.town.name}
                </Link>
              </p>
            )}
            <p className={bodyClass}>
              <a href="#book" data-cta="book_anchor" data-cta-location="postcode_check" className={linkClass}>
                Book a callback
              </a>
            </p>
          </>
        )}

        {verdict?.status === "not_covered" && (
          <>
            <p className={bodyClass}>We do not cover {verdict.district} yet.</p>
            <p className={bodyClass}>
              Ring us and we will tell you who to try:{" "}
              <a
                href={CALL_HREF}
                data-cta="phone"
                data-cta-location="postcode_check"
                data-cta-variant="text_link"
                className={`${linkClass} tabular-nums`}
              >
                {CALL_NUMBER_DISPLAY}
              </a>
              .
            </p>
          </>
        )}

        {verdict?.status === "invalid" && (
          <p className={bodyClass}>That does not look like a full UK postcode.</p>
        )}
      </div>
    </div>
  );
}
