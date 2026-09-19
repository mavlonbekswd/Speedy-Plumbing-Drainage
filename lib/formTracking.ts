"use client";

// One implementation of "what happens when somebody fills in the booking
// form", shared by every form on the site.
//
// Kept in one place because the alternative is three near-identical submit
// handlers, where a new event has to be added three times and can silently be
// added twice. Everything the form owes the business lives here: the start and
// the abandonment, the submission and its HTTP status, the click ids on the
// payload, the hashed identifiers and the Google conversion.
//
// The conversion reported to Google is the RECEIVED submission and nothing
// earlier. A form start is a micro-event for observation only.
//
// No event property here may carry a name, a phone number, an email, a full
// postcode or anything the customer typed in free text. PostHog is for
// behaviour; the lead itself goes to the business over the API route.

import { useCallback, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { submitBooking, type BookingInput, type BookingResult } from "@/lib/book";
import { reportConversion, setEnhancedConversionUserData } from "@/lib/gtag";
import { identifyUser } from "@/components/PosthogProvider";

export interface BookingFormTracking {
  /** Attach to the <form> element. */
  formRef: React.RefObject<HTMLFormElement | null>;
  /** Attach as onFocusCapture on the <form>: the visitor has started typing. */
  onStart: () => void;
  /** Call from the form's submit handler. Owns every event and the conversion.
   *  form_id is supplied by the hook, so the caller never passes it. */
  submit: (input: Omit<BookingInput, "form_id">, photos?: File[]) => Promise<BookingResult>;
}

export function useBookingFormTracking(formId: string, service?: string): BookingFormTracking {
  const formRef = useRef<HTMLFormElement | null>(null);
  const started = useRef(false);
  // Set the moment the form's fate is known, so an abandonment can never be
  // reported for a form that was in fact submitted.
  const settled = useRef(false);

  const base = useCallback(
    () => ({ form_id: formId, ...(service ? { service } : {}) }),
    [formId, service],
  );

  const onStart = useCallback(() => {
    if (started.current || settled.current) return;
    started.current = true;
    trackEvent("booking_form_start", base());
  }, [base]);

  const reportAbandon = useCallback(
    (transport?: "sendBeacon") => {
      if (!started.current || settled.current) return;
      settled.current = true;
      trackEvent("booking_form_abandon", base(), transport ? { transport } : undefined);
    },
    [base],
  );

  useEffect(() => {
    // Three ways out of a half-filled form, each needing different handling:
    //   visibilitychange to hidden fires first, while the page is still fully
    //     alive, so an ordinary request goes out;
    //   pagehide is the backstop for the browsers and paths that skip it, and
    //     needs sendBeacon because nothing else survives an unload;
    //   a client-side navigation produces neither, so the cleanup covers it.
    // The settled guard means whichever arrives first is the only one to send.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") reportAbandon();
    };
    const onPageHide = () => reportAbandon("sendBeacon");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      reportAbandon();
    };
  }, [reportAbandon]);

  const submit = useCallback(
    async (input: Omit<BookingInput, "form_id">, photos: File[] = []): Promise<BookingResult> => {
      // The honeypot is filled, so this is a bot. Nothing is tracked, nothing
      // is identified, nothing is posted and nothing is reported as a
      // conversion; the caller gets the ordinary success shape so the page
      // behaves exactly as it does for a human and the bot learns nothing.
      // settled is set so no abandonment is reported for it on unload either.
      if (input.website) {
        settled.current = true;
        return { ok: true, status: 200 };
      }

      settled.current = true;
      started.current = true;

      trackEvent("booking_form_submit", { ...base(), photo_count: photos.length });

      const lastService = input.service ?? service;
      identifyUser({
        name: input.name,
        phone: input.phone,
        ...(input.email ? { email: input.email } : {}),
        ...(lastService ? { service: lastService } : {}),
      });

      const result = await submitBooking({ ...input, form_id: formId }, photos);

      const sentPhotos = photos.length - (result.photosDropped ?? 0);

      if (result.ok) {
        // Awaited: the hashing is async, and an unawaited call would let the
        // conversion fire before the identifiers were attached to it.
        await setEnhancedConversionUserData({
          name: input.name,
          phone: input.phone,
          ...(input.email ? { email: input.email } : {}),
          postcode: input.postcode,
        });
        reportConversion("booking");
      }

      trackEvent(result.ok ? "booking_form_success" : "booking_form_error", {
        ...base(),
        photo_count: sentPhotos,
        ...(result.photosDropped ? { photos_dropped: result.photosDropped } : {}),
        http_status: result.status,
      });

      return result;
    },
    [base, formId, service],
  );

  return { formRef, onStart, submit };
}
