// Quote-journey tracking for /quote. Keeps Quote.jsx readable: the component
// calls these at the obvious moments, and this hook owns the once-only guards
// and the abandonment logic.
//
// Completion, not initiation: the Google Ads conversion fires only on
// quote_form_success, i.e. after /api/quote confirmed Telegram delivery.

import { useCallback, useEffect, useRef } from 'react'
import { trackEvent, identifyUser } from './analytics'
import { reportConversion, setEnhancedConversionUserData } from './gtag'

const FORM_ID = 'quote'

export function useQuoteTracking(steps, step) {
  const viewed = useRef(false)
  const started = useRef(false)
  // Set once the form's fate is known so a submitted form is never also
  // reported as abandoned.
  const settled = useRef(false)
  const stepRef = useRef(step)
  const maxStepRef = useRef(0)

  useEffect(() => {
    stepRef.current = step
    maxStepRef.current = Math.max(maxStepRef.current, step)
  }, [step])

  const send = useCallback(
    (name, props = {}, options) => trackEvent(name, { form_id: FORM_ID, ...props }, options),
    [],
  )

  const reportAbandon = useCallback(
    (transport) => {
      if (!started.current || settled.current) return
      settled.current = true
      send(
        'quote_form_abandon',
        {
          last_step_index: stepRef.current,
          last_step_name: steps[stepRef.current],
          steps_completed: maxStepRef.current,
        },
        transport ? { transport } : undefined,
      )
    },
    [send, steps],
  )

  useEffect(() => {
    // Ref guard: StrictMode runs this effect twice in dev.
    if (!viewed.current) {
      viewed.current = true
      send('quote_form_view')
    }
    // visibilitychange → tab hidden while the page is alive; pagehide → unload
    // (only sendBeacon survives it); cleanup → client-side navigation away.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') reportAbandon()
    }
    const onPageHide = () => reportAbandon('sendBeacon')
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
      reportAbandon()
    }
  }, [send, reportAbandon])

  return {
    /** First interaction with the form (focus/change). */
    start: useCallback(() => {
      if (started.current) return
      started.current = true
      send('quote_form_start')
    }, [send]),

    stepComplete: useCallback(
      (index, extra) => {
        started.current = true
        // A visitor who completes a step and then leaves is an abandon again.
        settled.current = false
        send('quote_step_complete', { step_index: index, step_name: steps[index], ...extra })
      },
      [send, steps],
    ),

    stepBack: useCallback(
      (fromIndex) => send('quote_step_back', { step_index: fromIndex, step_name: steps[fromIndex] }),
      [send, steps],
    ),

    validationError: useCallback(
      (index, fields) =>
        send('quote_validation_error', { step_index: index, step_name: steps[index], fields: fields.join(',') }),
      [send, steps],
    ),

    emergencyPrompt: useCallback(() => send('quote_emergency_call_prompt_shown'), [send]),

    photosAdded: useCallback((count) => send('quote_photos_added', { count }), [send]),

    /** Honeypot hit: close the journey silently (no abandon, no conversion). */
    spam: useCallback(() => {
      settled.current = true
    }, []),

    submit: useCallback(
      (props) => {
        settled.current = true
        send('quote_form_submit', props)
      },
      [send],
    ),

    /** Delivered: enhanced-conversion data first (awaited), then the conversion. */
    success: useCallback(
      async (props, user) => {
        settled.current = true
        send('quote_form_success', props)
        identifyUser({ ...user, service: props.service })
        await setEnhancedConversionUserData(user)
        reportConversion('quote')
      },
      [send],
    ),

    error: useCallback(
      (props) => {
        // Still on the form with their data — a later exit counts as abandon.
        settled.current = false
        send('quote_form_error', props)
      },
      [send],
    ),
  }
}
