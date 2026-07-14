// Central business configuration — the ONLY place contact details live.
// Every component, schema block and page reads from here.

export const businessConfig = {
  name: 'Speedy Plumbing & Drain',
  legalName: 'Speedy Plumbing & Drain',
  tagline: 'Professional plumbing and drainage services across Cambridge and surrounding areas.',
  phoneDisplay: '01223 482415',
  phoneHref: 'tel:+441223482415',
  phoneE164: '+441223482415',
  email: 'Speedyplumbing01@gmail.com',
  emailHref: 'mailto:Speedyplumbing01@gmail.com',

  // Not yet confirmed by the business owner — leave empty until supplied.
  // When a WhatsApp number is confirmed, set e.g. 'https://wa.me/44XXXXXXXXXX'
  // and WhatsApp buttons will appear automatically across the site.
  whatsappHref: '',

  // No confirmed physical address — do not display or add to schema until supplied.
  address: null,

  // No confirmed opening hours — the site shows "call to confirm availability"
  // instead of fake hours. Fill in when the owner confirms them.
  openingHours: null,

  // Never claim 24/7 unless the owner confirms it.
  emergencyNote: 'Emergency call-outs available — call to check same-day availability.',

  // Social profiles — only rendered when real URLs are added.
  socialLinks: [],

  // Placeholder production domain — update before go-live (also update
  // public/sitemap.xml and public/robots.txt).
  siteUrl: 'https://www.speedyplumbinganddrain.co.uk',

  serviceRegion: 'Cambridge and surrounding areas',
}
