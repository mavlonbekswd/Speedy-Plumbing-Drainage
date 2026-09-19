"use client";

// The one status block every booking form on the site renders, plus the field
// primitives and the validation the three forms share.
//
// Two rules drive the shape of this file:
//
//   1. The live region is ALWAYS mounted, empty in the idle state. A
//      `role="status"` element that only appears once there is something to say
//      is inserted and announced inconsistently across screen readers, and BB's
//      forms do exactly that. One `aria-live="polite"` wrapper per form, mounted
//      from the first paint, is the reliable version. The ERROR block is the one
//      exception: it is a role="alert" sibling of that region, because a failed
//      submission is assertive news and a live region nested inside another one
//      is announced twice by some screen readers and not at all by others.
//   2. Validation lives here rather than in each form, because a message that
//      drifts between the hero card and the full form is a message the customer
//      reads twice and trusts once.
//
// Nothing here calls the network, and nothing here touches analytics: the forms
// own their own lifecycle through lib/formTracking.ts.

import type { ReactNode } from "react";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";
import { normalizePhone } from "@/lib/phone";
import { normalizePostcode } from "@/lib/postcode";

export type FormState = "idle" | "sending" | "success" | "error";

// ---------------------------------------------------------------------------
// Field primitives
// ---------------------------------------------------------------------------

/** 17px is the floor that stops iOS zooming the page on focus; 52px is the tap target. */
export const FIELD_CLASS =
  "field w-full min-h-[52px] rounded-chip border border-line bg-white px-4 py-3 text-[17px] leading-[1.4] text-ink";

export const LABEL_CLASS = "text-[14px] font-semibold text-brand";

export const HINT_CLASS = "text-[13.5px] leading-[1.5] text-steel";

/** Inline, under its field, referenced by the field's aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[13.5px] font-semibold text-[#B3261E]">
      {message}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** One wording per rule, so the hero card and the full form cannot disagree. */
export const FIELD_MESSAGES = {
  phone: "Please enter a phone number we can ring you on.",
  postcode: "Please enter a full UK postcode, for example CB1 2AB.",
  name: "Please enter your name.",
  email: "Please enter a valid email address, or leave it blank.",
  service: "Please choose what the problem is.",
  urgency: "Please choose how soon you need us.",
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CoreValues {
  name: string;
  phone: string;
  postcode: string;
  /** Optional everywhere it appears, so a blank value is valid. */
  email?: string;
}

/**
 * Field key to message for everything that failed. The caller decides which
 * field takes focus, because the visual order differs between the forms.
 * The same values are re-validated server side; this is here so an empty
 * submit costs nothing and says something.
 */
export function validateCore(values: CoreValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!normalizePhone(values.phone)) errors.phone = FIELD_MESSAGES.phone;
  if (!normalizePostcode(values.postcode)) errors.postcode = FIELD_MESSAGES.postcode;
  if (values.name.trim().length < 2) errors.name = FIELD_MESSAGES.name;
  const email = values.email?.trim() ?? "";
  if (email && !EMAIL_RE.test(email)) errors.email = FIELD_MESSAGES.email;
  return errors;
}

// ---------------------------------------------------------------------------
// The status block
// ---------------------------------------------------------------------------

/**
 * Renders a sentence that contains the display number with the number itself as
 * a working tel: link. The error state exists so somebody whose request did not
 * send can still reach a plumber in one tap.
 */
function WithCallLink({ text, location }: { text: string; location: string }) {
  const parts = text.split(CALL_NUMBER_DISPLAY);
  if (parts.length === 1) return <>{text}</>;
  const out: ReactNode[] = [];
  parts.forEach((part, index) => {
    if (index > 0) {
      out.push(
        <a
          key={`n${index}`}
          href={CALL_HREF}
          data-cta="phone"
          data-cta-location={location}
          data-cta-variant="text_link"
          className="font-bold tabular-nums underline underline-offset-4"
        >
          {CALL_NUMBER_DISPLAY}
        </a>,
      );
    }
    out.push(<span key={`t${index}`}>{part}</span>);
  });
  return <>{out}</>;
}

export interface FormStatusProps {
  state: FormState;
  /** FORM_COPY success heading for this form. */
  successHeading: string;
  /** FORM_COPY success line. The inline card has a heading and no body. */
  successBody?: string;
  /** FORM_COPY error string, already given the display number. */
  errorText: string;
  /** From BookingResult. The lead went through; the pictures did not. */
  photosDropped?: number;
  className?: string;
}

export default function FormStatus({
  state,
  successHeading,
  successBody,
  errorText,
  photosDropped = 0,
  className = "",
}: FormStatusProps) {
  return (
    <div className={className}>
      <div aria-live="polite">
        {state === "success" && (
          <div className="flex flex-col gap-3">
            <p className="font-display text-[22px] font-bold leading-snug text-brand">
              {successHeading}
            </p>
            {successBody && <p className="text-[15.5px] leading-[1.65] text-slate">{successBody}</p>}
            {photosDropped > 0 && (
              <p className="text-[15.5px] leading-[1.65] text-slate">
                {photosDropped === 1
                  ? "Your photo did not come through with the request. "
                  : "Your photos did not come through with the request. "}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="whatsapp"
                  data-cta-location="form_success"
                  data-cta-variant="text_link"
                  className="font-bold text-brand underline underline-offset-4"
                >
                  Send it on WhatsApp
                </a>{" "}
                and we will put it with the job.
              </p>
            )}
          </div>
        )}
      </div>

      {/* A failed submission is an assertive announcement, not a polite one: the customer is
          waiting on an answer and the block carries the number they can ring instead. It sits
          OUTSIDE the polite region on purpose, because a nested live region is announced twice
          by some screen readers and swallowed entirely by others. */}
      {state === "error" && (
        <p
          role="alert"
          className="rounded-chip bg-[#FDECEA] px-4 py-3 text-[14.5px] font-semibold leading-[1.6] text-[#B3261E]"
        >
          <WithCallLink text={errorText} location="form_error" />
        </p>
      )}
    </div>
  );
}
