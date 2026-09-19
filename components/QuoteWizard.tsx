"use client";

// The six-step quote wizard on /quote: Problem, Urgency, Postcode, Details,
// Contact, Confirm.
//
// The shape is the owner's, carried over from the old site, and it does not
// grow: one question per screen is what makes a six-field form answerable on a
// phone. What changed is everything underneath it: the shared tracking hook,
// the shared validation, client-side photo compression, and a consent line that
// says what the details are used for instead of asking for a marketing tick.
//
// These inputs are CONTROLLED, unlike the other two forms: steps unmount when
// the customer moves on, and "Back keeps values" is only true if the values
// live above the step.
//
// PRIVACY: the step events carry the step number and its name. Never a service
// the customer picked together with anything that identifies them, never the
// postcode, never anything the customer typed as prose.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FORM_COPY } from "@/lib/claims";
import { checkPostcode } from "@/lib/coverage";
import { normalizePostcode, sanitizePostcodeInput } from "@/lib/postcode";
import { sanitizePhoneInput } from "@/lib/phone";
import { trackEvent } from "@/lib/analytics";
import { CALL_HREF, CALL_NUMBER_DISPLAY } from "@/lib/site";
import { useBookingFormTracking } from "@/lib/formTracking";
import HoneypotField from "@/components/HoneypotField";
import PhotoPicker from "@/components/PhotoPicker";
import Button from "@/components/ui/Button";
import FormStatus, {
  FIELD_CLASS,
  FieldError,
  FIELD_MESSAGES,
  HINT_CLASS,
  LABEL_CLASS,
  validateCore,
  type FormState,
} from "@/components/FormStatus";

const STEPS = ["Problem", "Urgency", "Postcode", "Details", "Contact", "Confirm"] as const;
const LAST = STEPS.length - 1;

const STEP_HEADINGS = [
  "What is the problem?",
  "How soon do you need us?",
  "What is your postcode?",
  "Anything else we should know?",
  "How do we reach you?",
  "Check your answers and send",
] as const;

export interface ProblemOption {
  value: string;
  label: string;
}

const SOMETHING_ELSE: ProblemOption = { value: "something-else", label: "Something else" };

const URGENCY_OPTIONS = [
  { value: "emergency", label: "Emergency" },
  { value: "urgent", label: "Urgent" },
  { value: "soon", label: "This week" },
  { value: "planned", label: "Planned work" },
] as const;

const CONTACT_METHODS = ["Phone call", "Text message", "WhatsApp"] as const;

interface WizardValues {
  service: string;
  urgency: string;
  postcode: string;
  details: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
}

const EMPTY: WizardValues = {
  service: "",
  urgency: "",
  postcode: "",
  details: "",
  name: "",
  phone: "",
  email: "",
  contactMethod: CONTACT_METHODS[0],
};

/** Which field takes focus when a step is refused, in the order it is read. */
const FOCUS_ORDER: Record<number, readonly string[]> = {
  0: ["service"],
  1: ["urgency"],
  2: ["postcode"],
  4: ["name", "phone", "email"],
};

/** Steps that can refuse to advance. Re-run before the final submit. */
const GATED_STEPS = [0, 1, 2, 4] as const;

const OPTION_CLASS =
  "press flex min-h-[52px] cursor-pointer items-center gap-3 rounded-chip border border-line bg-white px-4 py-2 text-[16px] text-ink";

/**
 * `services` comes from the server page (value = service slug, so the lead names a page the
 * business already has). Importing lib/services here would ship every page's copy to the browser.
 */
export default function QuoteWizard({
  services,
  intro = true,
}: {
  services: readonly ProblemOption[];
  /** false where the page already carries the heading, the ring-now line and the price line. */
  intro?: boolean;
}) {
  const PROBLEM_OPTIONS: ProblemOption[] = [...services, SOMETHING_ELSE];
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<WizardValues>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosDropped, setPhotosDropped] = useState(0);
  const [state, setState] = useState<FormState>("idle");

  // A stable form id and no service argument: the hook's abandonment effect
  // depends on its arguments, and feeding it the answer to step 1 would tear
  // the listeners down mid-form and report an abandonment for a live session.
  const { formRef, onStart, submit } = useBookingFormTracking("quote_wizard");

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // Not on mount: stealing focus on page load moves a reader past the H1.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  function set(key: keyof WizardValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function errorsForStep(index: number, source: WizardValues): Record<string, string> {
    if (index === 0) return source.service ? {} : { service: FIELD_MESSAGES.service };
    if (index === 1) return source.urgency ? {} : { urgency: FIELD_MESSAGES.urgency };
    if (index === 2) {
      return normalizePostcode(source.postcode) ? {} : { postcode: FIELD_MESSAGES.postcode };
    }
    if (index === 4) {
      const found = validateCore({
        name: source.name,
        phone: source.phone,
        postcode: source.postcode,
        email: source.email,
      });
      // The postcode has its own step and its own message there.
      delete found.postcode;
      return found;
    }
    return {};
  }

  function focusField(key: string) {
    const id =
      key === "service"
        ? `q-service-${PROBLEM_OPTIONS[0].value}`
        : key === "urgency"
          ? `q-urgency-${URGENCY_OPTIONS[0].value}`
          : `q-${key}`;
    document.getElementById(id)?.focus();
  }

  function next() {
    const found = errorsForStep(step, values);
    setErrors(found);
    const firstBad = (FOCUS_ORDER[step] ?? []).find((key) => found[key]);
    if (firstBad) {
      focusField(firstBad);
      return;
    }
    trackEvent("quote_step_complete", { step: step + 1, step_name: STEPS[step] });
    setStep((current) => Math.min(current + 1, LAST));
  }

  function back() {
    trackEvent("quote_step_back", { step: step + 1, step_name: STEPS[step] });
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  // Enter used to fire the form's submit handler from any step. It now advances,
  // exactly like Continue. Only from a text input: a textarea keeps its
  // newlines and a button keeps its own activation.
  function onKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    const target = event.target as HTMLElement;
    if (target.tagName !== "INPUT") return;
    if ((target as HTMLInputElement).type === "file") return;
    if (step < LAST) {
      event.preventDefault();
      next();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    // Back can empty a field that was filled, so every gate is re-checked here
    // rather than trusted from when it was first passed.
    for (const index of GATED_STEPS) {
      const found = errorsForStep(index, values);
      if (Object.keys(found).length > 0) {
        setErrors(found);
        setStep(index);
        return;
      }
    }

    const website = String(new FormData(event.currentTarget).get("website") ?? "");

    setState("sending");
    const result = await submit(
      {
        name: values.name.trim(),
        phone: values.phone.trim(),
        postcode: values.postcode.trim(),
        ...(values.email.trim() ? { email: values.email.trim() } : {}),
        service: values.service,
        urgency: values.urgency,
        ...(values.details.trim() ? { details: values.details.trim() } : {}),
        contactMethod: values.contactMethod,
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

  // Informational only. A postcode outside the footprint never blocks a step:
  // the customer may be booking for somewhere else, and the phone call settles it.
  const verdict = values.postcode.trim().length >= 2 ? checkPostcode(values.postcode) : null;
  const verdictLine =
    verdict?.status === "covered"
      ? `Yes, we cover ${verdict.district}.`
      : verdict?.status === "not_covered"
        ? `We do not cover ${verdict.district} yet. Carry on, and we will tell you who to try when we ring.`
        : null;

  const problemLabel = PROBLEM_OPTIONS.find((o) => o.value === values.service)?.label ?? "";
  const urgencyLabel = URGENCY_OPTIONS.find((o) => o.value === values.urgency)?.label ?? "";

  return (
    <div className="mx-auto w-full max-w-[44rem]">
      <div className="rounded-card border border-line bg-white p-5 shadow-card sm:p-8">
        {intro ? (
          <>
            <h2 className="font-display text-[clamp(24px,3vw,32px)] font-extrabold leading-[1.1] text-brand">
              {FORM_COPY.full.heading}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.6] text-slate">{FORM_COPY.full.sub}</p>
          </>
        ) : (
          <h2 className="sr-only">Your details, in six steps</h2>
        )}

        <FormStatus
          state={state}
          successHeading={FORM_COPY.full.successHeading}
          successBody={FORM_COPY.full.successBody}
          errorText={FORM_COPY.full.error(CALL_NUMBER_DISPLAY)}
          photosDropped={photosDropped}
          className={state === "idle" || state === "sending" ? "" : "mt-5"}
        />

        {state !== "success" && (
          <>
            <div className={`${intro ? "mt-6" : "mt-0"} flex items-center gap-4`}>
              <div
                role="progressbar"
                aria-label="Quote request progress"
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-valuenow={step + 1}
                aria-valuetext={`Step ${step + 1} of ${STEPS.length}`}
                className="h-2 flex-1 overflow-hidden rounded-pill bg-line"
              >
                <div
                  className="h-2 rounded-pill bg-cta"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <p className="text-[13.5px] font-semibold tabular-nums text-slate">
                Step {step + 1} of {STEPS.length}
              </p>
            </div>

            <p aria-live="polite" className="sr-only">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onFocusCapture={onStart}
              onKeyDown={onKeyDown}
              noValidate
              className="mt-6 flex flex-col gap-5"
            >
              <HoneypotField />

              <h3
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-[20px] font-bold leading-snug text-brand outline-none"
              >
                {STEP_HEADINGS[step]}
              </h3>

              {step === 0 && (
                <fieldset
                  aria-describedby={errors.service ? "q-service-error" : undefined}
                  className="flex flex-col gap-2"
                >
                  <legend className="sr-only">{STEP_HEADINGS[0]}</legend>
                  {PROBLEM_OPTIONS.map((option) => (
                    <label key={option.value} htmlFor={`q-service-${option.value}`} className={OPTION_CLASS}>
                      <input
                        id={`q-service-${option.value}`}
                        type="radio"
                        name="service"
                        value={option.value}
                        checked={values.service === option.value}
                        onChange={() => set("service", option.value)}
                        className="h-5 w-5 accent-brand"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                  <FieldError id="q-service-error" message={errors.service} />
                </fieldset>
              )}

              {step === 1 && (
                <>
                  <fieldset
                    aria-describedby={errors.urgency ? "q-urgency-error" : undefined}
                    className="flex flex-col gap-2"
                  >
                    <legend className="sr-only">{STEP_HEADINGS[1]}</legend>
                    {URGENCY_OPTIONS.map((option) => (
                      <label key={option.value} htmlFor={`q-urgency-${option.value}`} className={OPTION_CLASS}>
                        <input
                          id={`q-urgency-${option.value}`}
                          type="radio"
                          name="urgency"
                          value={option.value}
                          checked={values.urgency === option.value}
                          onChange={() => set("urgency", option.value)}
                          className="h-5 w-5 accent-brand"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                    <FieldError id="q-urgency-error" message={errors.urgency} />
                  </fieldset>

                  {values.urgency === "emergency" && (
                    <div className="flex flex-col gap-3 rounded-card border border-line bg-paper-2 p-4">
                      <p className="text-[16px] font-semibold leading-[1.5] text-brand">
                        Water coming through the ceiling? Ring us now.
                      </p>
                      <Button
                        as="a"
                        href={CALL_HREF}
                        size="lg"
                        className="tabular-nums"
                        data-cta="phone"
                        data-cta-location="quote_wizard"
                        data-cta-variant="primary_button"
                      >
                        Call {CALL_NUMBER_DISPLAY}
                      </Button>
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="q-postcode" className={LABEL_CLASS}>
                    {FORM_COPY.full.postcodeLabel}
                  </label>
                  <input
                    id="q-postcode"
                    name="postcode"
                    type="text"
                    autoComplete="postal-code"
                    maxLength={8}
                    spellCheck={false}
                    value={values.postcode}
                    onChange={(e) => set("postcode", sanitizePostcodeInput(e.target.value))}
                    aria-invalid={errors.postcode ? true : undefined}
                    aria-describedby={
                      [errors.postcode ? "q-postcode-error" : null, verdictLine ? "q-postcode-verdict" : null]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                    className={FIELD_CLASS}
                  />
                  <FieldError id="q-postcode-error" message={errors.postcode} />
                  {verdictLine && (
                    <p id="q-postcode-verdict" className={HINT_CLASS}>
                      {verdictLine}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="q-details" className={LABEL_CLASS}>
                      {FORM_COPY.full.problemLabel}
                    </label>
                    <textarea
                      id="q-details"
                      name="details"
                      rows={4}
                      value={values.details}
                      onChange={(e) => set("details", e.target.value)}
                      className={`${FIELD_CLASS} resize-y`}
                    />
                    <p className={HINT_CLASS}>This step is optional. Continue if you would rather tell us on the phone.</p>
                  </div>
                  <PhotoPicker id="q-photos" files={photos} onChange={setPhotos} />
                </>
              )}

              {step === 4 && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="q-name" className={LABEL_CLASS}>
                      {FORM_COPY.full.nameLabel}
                    </label>
                    <input
                      id="q-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "q-name-error" : undefined}
                      className={FIELD_CLASS}
                    />
                    <FieldError id="q-name-error" message={errors.name} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="q-phone" className={LABEL_CLASS}>
                      {FORM_COPY.full.phoneLabel}
                    </label>
                    <input
                      id="q-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={16}
                      spellCheck={false}
                      value={values.phone}
                      onChange={(e) => set("phone", sanitizePhoneInput(e.target.value))}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? "q-phone-error" : undefined}
                      className={FIELD_CLASS}
                    />
                    <FieldError id="q-phone-error" message={errors.phone} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="q-email" className={LABEL_CLASS}>
                      Email address (optional)
                    </label>
                    <input
                      id="q-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "q-email-error" : undefined}
                      className={FIELD_CLASS}
                    />
                    <FieldError id="q-email-error" message={errors.email} />
                  </div>

                  <fieldset className="flex flex-col gap-2">
                    <legend className={`${LABEL_CLASS} mb-1.5`}>How would you like us to get in touch?</legend>
                    {CONTACT_METHODS.map((method) => (
                      <label key={method} htmlFor={`q-contact-${method.replace(/\s+/g, "-").toLowerCase()}`} className={OPTION_CLASS}>
                        <input
                          id={`q-contact-${method.replace(/\s+/g, "-").toLowerCase()}`}
                          type="radio"
                          name="contactMethod"
                          value={method}
                          checked={values.contactMethod === method}
                          onChange={() => set("contactMethod", method)}
                          className="h-5 w-5 accent-brand"
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </fieldset>
                </>
              )}

              {step === LAST && (
                <>
                  <dl className="grid gap-x-6 gap-y-3 text-[15.5px] leading-[1.5] sm:grid-cols-[9rem_1fr]">
                    <dt className="font-semibold text-brand">Problem</dt>
                    <dd className="text-slate">{problemLabel}</dd>
                    <dt className="font-semibold text-brand">How soon</dt>
                    <dd className="text-slate">{urgencyLabel}</dd>
                    <dt className="font-semibold text-brand">Postcode</dt>
                    <dd className="text-slate">{values.postcode}</dd>
                    <dt className="font-semibold text-brand">Details</dt>
                    <dd className="text-slate">{values.details.trim() || "Not given"}</dd>
                    <dt className="font-semibold text-brand">Photos</dt>
                    <dd className="text-slate">{photos.length === 0 ? "None" : String(photos.length)}</dd>
                    <dt className="font-semibold text-brand">Name</dt>
                    <dd className="text-slate">{values.name}</dd>
                    <dt className="font-semibold text-brand">Phone</dt>
                    <dd className="tabular-nums text-slate">{values.phone}</dd>
                    <dt className="font-semibold text-brand">Email</dt>
                    <dd className="text-slate">{values.email.trim() || "Not given"}</dd>
                    <dt className="font-semibold text-brand">Contact by</dt>
                    <dd className="text-slate">{values.contactMethod}</dd>
                  </dl>

                  <p className={HINT_CLASS}>
                    We use these details to ring you back about this job. Read our{" "}
                    <Link href="/privacy" className="font-semibold text-brand underline underline-offset-4">
                      privacy notice
                    </Link>
                    .
                  </p>
                </>
              )}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                {step > 0 && (
                  <Button type="button" variant="light" size="lg" onClick={back}>
                    Back
                  </Button>
                )}

                {step < LAST ? (
                  <Button type="button" size="lg" onClick={next}>
                    Continue
                  </Button>
                ) : (
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="press inline-flex min-h-[56px] items-center justify-center rounded-pill bg-cta px-7 text-[16.5px] font-bold text-ink hover:bg-cta-deep disabled:opacity-50"
                  >
                    {state === "sending" ? FORM_COPY.full.submitting : FORM_COPY.full.submit}
                  </button>
                )}

                <a
                  href={CALL_HREF}
                  data-cta="phone"
                  data-cta-location="quote_wizard"
                  data-cta-variant="text_link"
                  className="text-[14.5px] font-semibold tabular-nums text-brand underline underline-offset-4"
                >
                  {FORM_COPY.full.preferToCall(CALL_NUMBER_DISPLAY)}
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
