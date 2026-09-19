"use client";

// The small "Let us call you" card that sits beside a hero and inside sections
// further down the page.
//
// Three fields and a button, nothing else: this is the form for somebody
// standing over a leak with only one hand to spare. Phone leads, full width; name
// and postcode share the row beneath, so the card reads as one field and a
// button while all three stay visible and addressable from the first paint.
//
// The inputs are UNCONTROLLED on purpose. components/PostcodeCheck.tsx writes a
// postcode straight onto the DOM node, and a React-controlled value would throw
// that write away on the next render.

import { useState } from "react";
import { FORM_COPY } from "@/lib/claims";
import { CALL_NUMBER_DISPLAY } from "@/lib/site";
import { sanitizePhoneInput } from "@/lib/phone";
import { sanitizePostcodeInput } from "@/lib/postcode";
import { useBookingFormTracking } from "@/lib/formTracking";
import HoneypotField from "@/components/HoneypotField";
import FormStatus, {
  FIELD_CLASS,
  FieldError,
  LABEL_CLASS,
  validateCore,
  type FormState,
} from "@/components/FormStatus";

/** Focus order on an empty submit: the first thing the customer is missing. */
const FOCUS_ORDER = ["phone", "name", "postcode"] as const;

export interface CallbackInlineProps {
  /** `${slug}_hero`, `area_${town}_hero`, and so on. Never reused across two forms on a page. */
  formId: string;
  service?: string;
  /** Prefix for the three field ids: `${idPrefix}-phone|-name|-postcode`. */
  idPrefix: string;
  title?: string;
}

export default function CallbackInline({
  formId,
  service,
  idPrefix,
  title = FORM_COPY.inline.heading,
}: CallbackInlineProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { formRef, onStart, submit } = useBookingFormTracking(formId, service);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const data = new FormData(event.currentTarget);
    const read = (key: string) => String(data.get(key) ?? "");
    const values = {
      phone: read("phone"),
      name: read("name"),
      postcode: read("postcode"),
    };

    // Nothing is sent and nothing is tracked until the form is fillable-in: the
    // hook reports a submission the moment it is called.
    const found = validateCore(values);
    setErrors(found);
    const firstBad = FOCUS_ORDER.find((key) => found[key]);
    if (firstBad) {
      document.getElementById(`${idPrefix}-${firstBad}`)?.focus();
      return;
    }

    setState("sending");
    const website = read("website");
    const result = await submit({
      name: values.name.trim(),
      phone: values.phone.trim(),
      postcode: values.postcode.trim(),
      ...(service ? { service } : {}),
      ...(website ? { website } : {}),
    });
    // The values stay in the DOM on an error, so a retry costs one tap.
    setState(result.ok ? "success" : "error");
  }

  return (
    <div className="w-full rounded-card border border-line bg-white p-5 shadow-card sm:p-6">
      <FormStatus
        state={state}
        successHeading={FORM_COPY.inline.successHeading}
        errorText={FORM_COPY.inline.error(CALL_NUMBER_DISPLAY)}
        className={state === "error" ? "mb-4" : ""}
      />

      {state !== "success" && (
        <>
          <p className="font-display text-[19px] font-bold leading-snug text-brand">{title}</p>
          <p className="mb-4 mt-1 text-[14.5px] leading-[1.5] text-slate">{FORM_COPY.inline.sub}</p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            onFocusCapture={onStart}
            noValidate
            className="flex flex-col gap-3"
          >
            <HoneypotField />

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-phone`} className={LABEL_CLASS}>
                {FORM_COPY.full.phoneLabel}
              </label>
              <input
                id={`${idPrefix}-phone`}
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                maxLength={16}
                spellCheck={false}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? `${idPrefix}-phone-error` : undefined}
                onInput={(e) => {
                  e.currentTarget.value = sanitizePhoneInput(e.currentTarget.value);
                }}
                className={FIELD_CLASS}
              />
              <FieldError id={`${idPrefix}-phone-error`} message={errors.phone} />
            </div>

            <div className="grid grid-cols-[1fr_0.85fr] gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idPrefix}-name`} className={LABEL_CLASS}>
                  {FORM_COPY.full.nameLabel}
                </label>
                <input
                  id={`${idPrefix}-name`}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
                  className={FIELD_CLASS}
                />
                <FieldError id={`${idPrefix}-name-error`} message={errors.name} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idPrefix}-postcode`} className={LABEL_CLASS}>
                  {FORM_COPY.full.postcodeLabel}
                </label>
                <input
                  id={`${idPrefix}-postcode`}
                  name="postcode"
                  type="text"
                  required
                  autoComplete="postal-code"
                  maxLength={8}
                  spellCheck={false}
                  aria-invalid={errors.postcode ? true : undefined}
                  aria-describedby={errors.postcode ? `${idPrefix}-postcode-error` : undefined}
                  onInput={(e) => {
                    e.currentTarget.value = sanitizePostcodeInput(e.currentTarget.value);
                  }}
                  className={FIELD_CLASS}
                />
                <FieldError id={`${idPrefix}-postcode-error`} message={errors.postcode} />
              </div>
            </div>

            <button
              type="submit"
              disabled={state === "sending"}
              className="press mt-1 inline-flex min-h-[56px] items-center justify-center rounded-pill bg-cta px-6 text-[16.5px] font-bold text-ink hover:bg-cta-deep disabled:opacity-50"
            >
              {state === "sending" ? FORM_COPY.inline.submitting : FORM_COPY.inline.submit}
            </button>

            <p className="text-center text-[12.5px] text-steel">{FORM_COPY.inline.finePrint}</p>
          </form>
        </>
      )}
    </div>
  );
}
