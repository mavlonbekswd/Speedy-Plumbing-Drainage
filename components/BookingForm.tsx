"use client";

// The full booking section, `#book`, which every page anchors its "Book a
// callback" links to.
//
// Field order is the order a person in a flooded kitchen can answer in: the
// number we ring back on first, then where, then who, then the two optional
// fields. The ids f-phone, f-postcode, f-name, f-details and f-photos are
// locked; components/PostcodeCheck.tsx writes into f-postcode and the test
// suite fills all of them by id.
//
// Uncontrolled inputs, for the same reason as CallbackInline: a value written
// onto the DOM node from outside React has to survive.

import { useState } from "react";
import { FORM_COPY } from "@/lib/claims";
import { CALL_HREF, CALL_NUMBER_DISPLAY } from "@/lib/site";
import { sanitizePhoneInput } from "@/lib/phone";
import { sanitizePostcodeInput } from "@/lib/postcode";
import { useBookingFormTracking } from "@/lib/formTracking";
import HoneypotField from "@/components/HoneypotField";
import PhotoPicker from "@/components/PhotoPicker";
import SectionHeading from "@/components/ui/SectionHeading";
import FormStatus, {
  FIELD_CLASS,
  FieldError,
  LABEL_CLASS,
  validateCore,
  type FormState,
} from "@/components/FormStatus";

/** Visual order, so an empty submit lands on the topmost thing that is missing. */
const FOCUS_ORDER = ["phone", "postcode", "name"] as const;

export interface BookingFormProps {
  heading: string;
  /**
   * The section eyebrow. Every section heading on the site carries one, and this section had
   * none: "Callback" is what the form does and what the buttons that point at #book say.
   */
  eyebrow?: string;
  sub?: string;
  /** `home_booking`, `${slug}_booking`, `area_${town}_booking`, `contact_booking`. */
  formId: string;
  service?: string;
  /**
   * Opt-in, and nothing else changes: the section drops its own full-width band
   * and its two-column grid so the page can put the form in a column of its own
   * (the right-hand side of /contact). The `<section id="book">`, the field ids,
   * the heading, the sub, the tracking and the card itself are the same in both
   * shapes, so #book, the tests and the analytics do not know the difference.
   * Left out, the component renders exactly what it always has.
   */
  embedded?: boolean;
  /**
   * paper-2 with a hairline top, for alternating against the section above, exactly as every
   * other section component takes it. The default is what this section has always been; the home
   * page turns it off because the FAQ section directly above it is tinted.
   */
  tinted?: boolean;
}

export default function BookingForm({
  heading,
  eyebrow = "Callback",
  sub = FORM_COPY.full.sub,
  formId,
  service,
  embedded = false,
  tinted = true,
}: BookingFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosDropped, setPhotosDropped] = useState(0);
  const { formRef, onStart, submit } = useBookingFormTracking(formId, service);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const data = new FormData(event.currentTarget);
    const read = (key: string) => String(data.get(key) ?? "");
    const values = {
      phone: read("phone"),
      postcode: read("postcode"),
      name: read("name"),
      details: read("details"),
    };

    const found = validateCore(values);
    setErrors(found);
    const firstBad = FOCUS_ORDER.find((key) => found[key]);
    if (firstBad) {
      // Nothing has been posted and no submission has been reported: the hook
      // is only reached once there is a lead to report.
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }

    setState("sending");
    const website = read("website");
    const result = await submit(
      {
        name: values.name.trim(),
        phone: values.phone.trim(),
        postcode: values.postcode.trim(),
        ...(values.details.trim() ? { details: values.details.trim() } : {}),
        ...(service ? { service } : {}),
        ...(website ? { website } : {}),
      },
      photos,
    );

    if (result.ok) {
      setPhotosDropped(result.photosDropped ?? 0);
      setState("success");
    } else {
      setState("error");
    }
  }

  const card = (
    <div className="rounded-card border border-line bg-white p-5 shadow-card sm:p-8">
      <FormStatus
        state={state}
        successHeading={FORM_COPY.full.successHeading}
        successBody={FORM_COPY.full.successBody}
        errorText={FORM_COPY.full.error(CALL_NUMBER_DISPLAY)}
        photosDropped={photosDropped}
        className={state === "error" ? "mb-5" : ""}
      />

      {state !== "success" && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onFocusCapture={onStart}
          noValidate
          className="flex flex-col gap-5"
        >
          <HoneypotField />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-phone" className={LABEL_CLASS}>
              {FORM_COPY.full.phoneLabel}
            </label>
            <input
              id="f-phone"
              name="phone"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              maxLength={16}
              spellCheck={false}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "f-phone-error" : undefined}
              onInput={(e) => {
                e.currentTarget.value = sanitizePhoneInput(e.currentTarget.value);
              }}
              className={FIELD_CLASS}
            />
            <FieldError id="f-phone-error" message={errors.phone} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-postcode" className={LABEL_CLASS}>
              {FORM_COPY.full.postcodeLabel}
            </label>
            <input
              id="f-postcode"
              name="postcode"
              type="text"
              required
              autoComplete="postal-code"
              maxLength={8}
              spellCheck={false}
              aria-invalid={errors.postcode ? true : undefined}
              aria-describedby={errors.postcode ? "f-postcode-error" : undefined}
              onInput={(e) => {
                e.currentTarget.value = sanitizePostcodeInput(e.currentTarget.value);
              }}
              className={FIELD_CLASS}
            />
            <FieldError id="f-postcode-error" message={errors.postcode} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-name" className={LABEL_CLASS}>
              {FORM_COPY.full.nameLabel}
            </label>
            <input
              id="f-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "f-name-error" : undefined}
              className={FIELD_CLASS}
            />
            <FieldError id="f-name-error" message={errors.name} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-details" className={LABEL_CLASS}>
              {FORM_COPY.full.problemLabel}
            </label>
            <textarea
              id="f-details"
              name="details"
              rows={3}
              className={`${FIELD_CLASS} resize-y`}
            />
          </div>

          <PhotoPicker id="f-photos" files={photos} onChange={setPhotos} />

          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={state === "sending"}
              className="press inline-flex min-h-[56px] items-center justify-center rounded-pill bg-cta px-7 text-[16.5px] font-bold text-ink hover:bg-cta-deep disabled:opacity-50"
            >
              {state === "sending" ? FORM_COPY.full.submitting : FORM_COPY.full.submit}
            </button>
            <a
              href={CALL_HREF}
              data-cta="phone"
              data-cta-location="booking_section"
              data-cta-variant="text_link"
              className="text-[14.5px] font-semibold tabular-nums text-brand underline underline-offset-4"
            >
              {FORM_COPY.full.preferToCall(CALL_NUMBER_DISPLAY)}
            </a>
          </div>
        </form>
      )}
    </div>
  );

  // One column, no band: the page around it supplies the background and the grid.
  if (embedded) {
    return (
      <section id="book">
        <SectionHeading eyebrow={eyebrow} title={heading} sub={sub} />
        <div className="mt-6">{card}</div>
      </section>
    );
  }

  return (
    <section
      id="book"
      className={`py-14 md:py-20 ${tinted ? "border-t border-line bg-paper-2" : "bg-paper"}`}
    >
      <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 md:grid-cols-[1fr_1.15fr] md:gap-16">
        <SectionHeading eyebrow={eyebrow} title={heading} sub={sub} />

        {card}
      </div>
    </section>
  );
}
