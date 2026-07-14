import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Send,
} from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { services } from '../data/services'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'

const URGENCIES = [
  { value: 'emergency', label: 'Emergency', hint: 'Water flowing now / risk of damage' },
  { value: 'urgent', label: 'Urgent', hint: 'Needs attention within a day or two' },
  { value: 'soon', label: 'This week', hint: 'A problem, but contained' },
  { value: 'planned', label: 'Planned work', hint: 'Quotes, refits, improvements' },
]

const CONTACT_METHODS = ['Phone call', 'Text message', 'Email']

const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i
const PHONE_RE = /^[\d\s()+-]{10,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const steps = ['Problem', 'Urgency', 'Postcode', 'Details', 'Contact', 'Confirm']

const initialForm = {
  service: '',
  urgency: '',
  postcode: '',
  details: '',
  photos: [],
  name: '',
  phone: '',
  email: '',
  contactMethod: 'Phone call',
  consent: false,
  company: '', // honeypot — humans never see or fill this
}

export default function Quote() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('editing') // editing | submitting | success
  const reduced = useReducedMotion()
  const liveRef = useRef(null)

  const set = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const stepErrors = useMemo(() => {
    return {
      0: () => (form.service ? {} : { service: 'Please choose the problem type.' }),
      1: () => (form.urgency ? {} : { urgency: 'Please choose how urgent this is.' }),
      2: () =>
        POSTCODE_RE.test(form.postcode.trim())
          ? {}
          : { postcode: 'Please enter a full UK postcode, e.g. CB1 2AB.' },
      3: () =>
        form.details.trim().length >= 10
          ? {}
          : { details: 'Please describe the problem in a sentence or two.' },
      4: () => {
        const e = {}
        if (form.name.trim().length < 2) e.name = 'Please enter your full name.'
        if (!PHONE_RE.test(form.phone.trim())) e.phone = 'Please enter a valid telephone number.'
        if (!EMAIL_RE.test(form.email.trim())) e.email = 'Please enter a valid email address.'
        return e
      },
      5: () => (form.consent ? {} : { consent: 'Please confirm you’re happy for us to contact you.' }),
    }
  }, [form])

  function next() {
    const e = stepErrors[step]()
    setErrors(e)
    if (Object.keys(e).length === 0) {
      setStep((s) => Math.min(s + 1, steps.length - 1))
      liveRef.current?.focus()
    }
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0))
    liveRef.current?.focus()
  }

  function onPhotos(fileList) {
    const files = Array.from(fileList || []).slice(0, 4)
    set('photos')(files)
  }

  async function submit(e) {
    e.preventDefault()
    const errs = stepErrors[5]()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    // Spam protection placeholder: silently drop obvious bot submissions.
    if (form.company !== '') {
      setStatus('success')
      return
    }

    setStatus('submitting')
    const enquiry = {
      service: form.service,
      urgency: form.urgency,
      postcode: form.postcode.trim().toUpperCase(), // stored with the enquiry
      details: form.details.trim(),
      photoNames: form.photos.map((f) => f.name),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      preferredContact: form.contactMethod,
      consent: form.consent,
      submittedAt: new Date().toISOString(),
    }

    // TODO: connect to a real backend / email service (e.g. a serverless
    // endpoint) before go-live. Until then the enquiry is logged locally so
    // the flow can be tested end-to-end.
    console.info('[quote-enquiry]', enquiry)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setStatus('success')
  }

  const stepMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, x: 32 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -32 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }

  const inputCls =
    'w-full min-h-12 rounded-sm border border-charcoal/15 bg-white px-4 py-3 text-base text-charcoal outline-none transition-colors focus:border-blue placeholder:text-steel'

  const fieldError = (key) =>
    errors[key] ? (
      <p className="mt-2 flex items-center gap-1.5 text-sm text-amber-700" role="alert">
        <AlertTriangle className="size-3.5" aria-hidden="true" />
        {errors[key]}
      </p>
    ) : null

  return (
    <>
      <Seo
        title="Request a Quote"
        description={`Request a plumbing or drainage quote from ${businessConfig.name} — takes about a minute. Or call ${businessConfig.phoneDisplay}.`}
        path="/quote"
        jsonLd={[breadcrumbSchema([{ name: 'Request a Quote', path: '/quote' }])]}
      />

      <PageHero
        eyebrow="Request a quote"
        title="Tell us the problem. We’ll price the fix."
        intro="Around one minute, six quick steps. Photos help us quote accurately. Anything urgent? Skip the form and call."
        crumbs={[{ name: 'Request a Quote', path: '/quote' }]}
      >
        <div className="mt-8">
          <Button href={businessConfig.phoneHref} icon={Phone} variant="emergency">
            Emergency? Call {businessConfig.phoneDisplay}
          </Button>
        </div>
      </PageHero>

      <section className="bg-mist px-5 py-20 text-charcoal md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          {status === 'success' ? (
            <div className="rounded-sm border border-charcoal/10 bg-white p-10 text-center md:p-14" role="status">
              <CheckCircle2 className="mx-auto size-14 text-blue" aria-hidden="true" />
              <h2 className="display-md mt-6">Request received</h2>
              <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-steel-dark">
                Thank you. Speedy Plumbing &amp; Drain has received your request. Our team will
                contact you using the details provided.
              </p>
              <p className="mt-8 text-sm text-steel-dark">
                Need us sooner?{' '}
                <a href={businessConfig.phoneHref} className="font-semibold text-blue underline-offset-4 hover:underline">
                  Call {businessConfig.phoneDisplay}
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="rounded-sm border border-charcoal/10 bg-white p-6 md:p-10">
              {/* Progress indicator */}
              <div aria-hidden="true" className="mb-3 flex gap-1.5">
                {steps.map((label, i) => (
                  <span
                    key={label}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= step ? 'bg-blue' : 'bg-charcoal/10'
                    }`}
                  />
                ))}
              </div>
              <p
                ref={liveRef}
                tabIndex={-1}
                aria-live="polite"
                className="mb-8 text-sm font-semibold tracking-wide text-steel-dark uppercase outline-none"
              >
                Step {step + 1} of {steps.length} — {steps[step]}
              </p>

              {/* Honeypot (spam protection placeholder) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => set('company')(e.target.value)}
                />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {step === 0 && (
                  <motion.fieldset key="s0" {...stepMotion}>
                    <legend className="display-md">What’s the problem?</legend>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {services.map((s) => (
                        <label
                          key={s.slug}
                          className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3.5 transition-colors ${
                            form.service === s.name
                              ? 'border-blue bg-blue/5'
                              : 'border-charcoal/15 hover:border-blue/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={s.name}
                            checked={form.service === s.name}
                            onChange={() => set('service')(s.name)}
                            className="size-4 accent-[#2f6fed]"
                          />
                          <span className="text-base font-medium">{s.name}</span>
                        </label>
                      ))}
                      <label
                        className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3.5 transition-colors ${
                          form.service === 'Something else'
                            ? 'border-blue bg-blue/5'
                            : 'border-charcoal/15 hover:border-blue/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value="Something else"
                          checked={form.service === 'Something else'}
                          onChange={() => set('service')('Something else')}
                          className="size-4 accent-[#2f6fed]"
                        />
                        <span className="text-base font-medium">Something else</span>
                      </label>
                    </div>
                    {fieldError('service')}
                  </motion.fieldset>
                )}

                {step === 1 && (
                  <motion.fieldset key="s1" {...stepMotion}>
                    <legend className="display-md">How urgent is it?</legend>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {URGENCIES.map((u) => (
                        <label
                          key={u.value}
                          className={`cursor-pointer rounded-sm border px-5 py-4 transition-colors ${
                            form.urgency === u.value
                              ? 'border-blue bg-blue/5'
                              : 'border-charcoal/15 hover:border-blue/50'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="urgency"
                              value={u.value}
                              checked={form.urgency === u.value}
                              onChange={() => set('urgency')(u.value)}
                              className="size-4 accent-[#2f6fed]"
                            />
                            <span className="text-base font-semibold">{u.label}</span>
                          </span>
                          <span className="mt-1 block pl-7 text-sm text-steel-dark">{u.hint}</span>
                        </label>
                      ))}
                    </div>
                    {fieldError('urgency')}
                    {form.urgency === 'emergency' && (
                      <p className="mt-5 flex items-start gap-2 rounded-sm border border-amber/40 bg-amber/10 p-4 text-sm">
                        <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span>
                          For anything flooding right now, calling is faster:{' '}
                          <a href={businessConfig.phoneHref} className="font-bold underline underline-offset-2">
                            {businessConfig.phoneDisplay}
                          </a>
                        </span>
                      </p>
                    )}
                  </motion.fieldset>
                )}

                {step === 2 && (
                  <motion.div key="s2" {...stepMotion}>
                    <label htmlFor="q-postcode" className="display-md block">
                      Where is the property?
                    </label>
                    <p className="mt-3 text-sm text-steel-dark">
                      Your postcode confirms coverage and travel time — it’s stored with your enquiry.
                    </p>
                    <input
                      id="q-postcode"
                      type="text"
                      required
                      autoComplete="postal-code"
                      inputMode="text"
                      placeholder="e.g. CB1 2AB"
                      value={form.postcode}
                      onChange={(e) => set('postcode')(e.target.value)}
                      className={`${inputCls} mt-6 max-w-xs uppercase`}
                    />
                    {fieldError('postcode')}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" {...stepMotion}>
                    <label htmlFor="q-details" className="display-md block">
                      Describe the problem
                    </label>
                    <textarea
                      id="q-details"
                      rows={5}
                      required
                      placeholder="What’s happening, where in the property, and how long it’s been going on…"
                      value={form.details}
                      onChange={(e) => set('details')(e.target.value)}
                      className={`${inputCls} mt-6 resize-y`}
                    />
                    {fieldError('details')}

                    <div className="mt-7">
                      <label
                        htmlFor="q-photos"
                        className="flex cursor-pointer items-center gap-3 rounded-sm border border-dashed border-charcoal/25 px-5 py-4 text-sm font-medium text-steel-dark transition-colors hover:border-blue"
                      >
                        <Camera className="size-5 text-blue" aria-hidden="true" />
                        Add photos (optional, up to 4) — they make quotes much more accurate
                      </label>
                      <input
                        id="q-photos"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => onPhotos(e.target.files)}
                        className="sr-only"
                      />
                      {form.photos.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-steel-dark">
                          {form.photos.map((f) => (
                            <li key={f.name} className="flex items-center gap-2">
                              <CheckCircle2 className="size-3.5 text-blue" aria-hidden="true" />
                              {f.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="s4" {...stepMotion}>
                    <p className="display-md">How do we reach you?</p>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="q-name" className="mb-2 block text-sm font-semibold">
                          Full name
                        </label>
                        <input
                          id="q-name"
                          type="text"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => set('name')(e.target.value)}
                          className={inputCls}
                        />
                        {fieldError('name')}
                      </div>
                      <div>
                        <label htmlFor="q-phone" className="mb-2 block text-sm font-semibold">
                          Telephone number
                        </label>
                        <input
                          id="q-phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          value={form.phone}
                          onChange={(e) => set('phone')(e.target.value)}
                          className={inputCls}
                        />
                        {fieldError('phone')}
                      </div>
                      <div>
                        <label htmlFor="q-email" className="mb-2 block text-sm font-semibold">
                          Email address
                        </label>
                        <input
                          id="q-email"
                          type="email"
                          required
                          autoComplete="email"
                          inputMode="email"
                          value={form.email}
                          onChange={(e) => set('email')(e.target.value)}
                          className={inputCls}
                        />
                        {fieldError('email')}
                      </div>
                      <fieldset className="sm:col-span-2">
                        <legend className="mb-2 text-sm font-semibold">Preferred contact method</legend>
                        <div className="flex flex-wrap gap-3">
                          {CONTACT_METHODS.map((method) => (
                            <label
                              key={method}
                              className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm border px-4 py-2.5 text-sm font-medium transition-colors ${
                                form.contactMethod === method
                                  ? 'border-blue bg-blue/5'
                                  : 'border-charcoal/15 hover:border-blue/50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="contactMethod"
                                value={method}
                                checked={form.contactMethod === method}
                                onChange={() => set('contactMethod')(method)}
                                className="size-4 accent-[#2f6fed]"
                              />
                              {method}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="s5" {...stepMotion}>
                    <p className="display-md">Check &amp; send</p>
                    <dl className="mt-7 space-y-2.5 rounded-sm bg-mist p-6 text-sm">
                      {[
                        ['Problem', form.service],
                        ['Urgency', URGENCIES.find((u) => u.value === form.urgency)?.label],
                        ['Postcode', form.postcode.toUpperCase()],
                        ['Name', form.name],
                        ['Telephone', form.phone],
                        ['Email', form.email],
                        ['Preferred contact', form.contactMethod],
                        ['Photos', form.photos.length ? `${form.photos.length} attached` : 'None'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex gap-3">
                          <dt className="w-36 shrink-0 font-semibold">{label}:</dt>
                          <dd className="text-steel-dark">{value}</dd>
                        </div>
                      ))}
                    </dl>

                    <label className="mt-7 flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => set('consent')(e.target.checked)}
                        className="mt-1 size-4.5 accent-[#2f6fed]"
                      />
                      <span className="text-sm leading-relaxed text-steel-dark">
                        I’m happy for {businessConfig.name} to contact me about this enquiry using the
                        details provided. Your information is used only to respond to your request and
                        is never sold or shared for marketing.
                      </span>
                    </label>
                    {fieldError('consent')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between gap-4 border-t border-charcoal/10 pt-7">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex min-h-12 items-center gap-2 rounded-sm px-4 text-sm font-bold tracking-widest text-steel-dark uppercase transition-colors hover:text-charcoal"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-charcoal px-7 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-blue"
                  >
                    Continue
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-blue px-7 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-charcoal disabled:opacity-60"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" aria-hidden="true" />
                        Submit Request
                      </>
                    )}
                  </button>
                )}
              </div>

              <p className="mt-6 text-center text-xs text-steel-dark">
                Prefer email?{' '}
                <a href={businessConfig.emailHref} className="inline-flex items-center gap-1 font-semibold text-blue underline-offset-4 hover:underline">
                  <Mail className="size-3" aria-hidden="true" />
                  {businessConfig.email}
                </a>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
