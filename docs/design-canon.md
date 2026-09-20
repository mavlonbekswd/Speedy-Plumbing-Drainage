# Design canon

One role, one style, on every page. Written on 19 Sept 2026 after the owner found the same element
styled two ways on different pages. A script measured every button, heading, card and section on
14 pages; the "measured drift" notes below record what was wrong at the time and has since been
fixed. Before adding a section or a page, find its role here and use that style. If a new role is
genuinely needed, add it here first.

Heroes: every static page renders `components/static/StaticHero.tsx` (through `components/hub/HubHero.tsx`
on the two hub pages); service and town pages render `components/ServiceHero.tsx`; the home page
`components/home/HomeHero.tsx`. All three share one order: breadcrumb, eyebrow, H1, Call then
WhatsApp, fact lines, sub, with `components/HeroBackdrop.tsx` behind at 50% opacity.

## The roles

### Section headings (h2 that opens a page section)
`SectionHeading` (components/ui/SectionHeading.tsx) is the only way to render one: 12px uppercase eyebrow in `text-tint` (tracking 0.16em) above a `font-display font-extrabold text-brand` title that renders 42px on desktop. EVERY section heading has an eyebrow AND ends with a full stop or a question mark. Measured drift: 32 headings follow this; 7 have the eyebrow but no full stop ("Recent work", "Local Plumber", "What we get called out to do" ...); 6 have neither eyebrow nor full stop ("Ask us to ring you", "Book a plumber in Cambridge"). Fix all 13 kinds: add the full stop, add a short plain eyebrow where missing (for the booking form: "Callback"). Headings that come from content data (`bookingHeading`, `problems.heading`, `ctaBand.heading`, etc. in content/services/*.ts and the town template) get the full stop in the data. A heading that already ends in "?" stays as it is.

### Sub-section headings inside prose (h2/h3 inside an article, a legal page, ContentSections, a gallery group)
One style: `font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] text-brand`, no eyebrow, no full stop (they are labels), a "?" allowed. Measured drift: 30px (28 uses) vs 34px (10 uses: /projects group headings and one town-page block). Make them all the 30px style.

### Card titles (h3)
One style: `font-display text-[19px] font-bold leading-snug text-brand`. Measured drift: 19px (50 uses), 18px (/about "What we can put in writing" cards), 21px (/guarantee cover cards), and the /blog index post cards use an h2 at 21px under a 13px eyebrow. Make them all 19px; the blog cards' date line becomes the standard 12px eyebrow. County labels (13px `text-tint` uppercase) are eyebrow-style labels and stay.

### Eyebrows
12px everywhere (`text-[12px] font-semibold uppercase tracking-[0.16em] text-tint`, `text-tint-bright` on navy). Measured drift: 11px on urgent service heroes, 13px on the blog index. Make them 12px. (The first-screen word budget in tests/town-headline.spec.ts counts words, not pixels, so this is safe.)

### The key facts, in two bands
`components/TickChips.tsx` renders both, and every page that has one has both, in the same two
places (home, /services, every service page, every town page):
- `part="figures"`: four left-aligned figures (24/7, 45 min, 1 year, 10,000) directly under the hero.
- `part="ticks"`: the four tick points, the price sentence, and the guarantee line with its scope,
  lower on the page, directly before the navy call band (on the home page, before "Where we work").
A page never renders one without the other: "1 year" is a figure, and the guarantee's scope
sentence lives in the ticks band. Both are thin bands: `py-10 md:py-12`, `bg-paper-2 border-t border-line`.

### Buttons: one style per role
All buttons go through `components/ui/Button.tsx`. Roles and their one style:
- Primary call: `variant="primary"`. Hero size `xl` (60px). Inside a navy band or a card: size `lg` (52px).
- WhatsApp: `variant="whatsapp"` on light backgrounds, the outlined light variant on navy bands. Same size as the call button beside it, always. Measured drift: on /contact the Call button is 60px and the WhatsApp button beside it is 52px. Make the pair match.
- Callback ("Book a callback", `data-cta="book_anchor"`): measured drift and the owner's third and fourth screenshots: a WHITE outlined 52px pill under the answer cards, and a NAVY filled 44px pill inside the "Not on the list?" box, on the same page. Canon: `variant="dark"` size `lg` (navy, 52px) everywhere a callback button appears on a light background. Text-link callbacks ("Ask us to ring you" under hero buttons) stay text links.
- Form submit: amber, 56px, as now. The postcode "Check" button: 52px as now.
- Accordion rows (FAQ items and problem-grid items): ONE row height and padding. Measured drift: FAQ rows 72px, problem rows 64px. Make both 64px on desktop with the same title size (17px `font-display font-bold`) and the same plus/minus control.
- Chips (town links, gallery jump links): 44px, `rounded-chip`, `border border-line`, 15px semibold `text-brand`, white background (paper background only when the chip sits on a white card). Leave the navy-band chip variant on the home page.

### Cards
`rounded-card border border-line bg-white shadow-card`, padding `p-6` (24px); `p-8` only for a form card or the big figure card. Measured drift: town-page service cards use 20px padding. Make them 24px. Photo tiles: `rounded-card border border-line`, no shadow.

### Enlargeable photos

A photo tile that carries a picture worth looking closely at is wrapped in `components/ZoomableImage.tsx`, which is a server component: a button around the picture only, never around the caption, with `cursor-zoom-in`, the sitewide `:focus-visible` outline and no visual of its own, so the tile keeps exactly the border and rounded corners it had. `components/PhotoLightbox.tsx` is mounted once in `app/layout.tsx` and is the only client component involved; it opens a native `<dialog>` with a `bg-ink/85` backdrop, the caption at 14px, and a 44px close button in the top right. Escape, the close button and a click on the backdrop all close it, and focus goes back to the tile.

**These enlarge:** the photo tiles in `ProofStrip` (not the clip beside them), both variants of `IllustrationRow`, `static/JobPhotoRow`, the three pictures in `home/Reviews`, the in-article photographs in `blog/PostBody`, and every photo tile on `/projects`.

**These never do:** hero backdrops (`components/HeroBackdrop.tsx`, decoration at 50% opacity), the service cards on the home page and `/services` (the whole card is already one link), the logo, video posters and clips (`components/WorkVideo.tsx` owns its own play control), and the van graphic on `/about`, which is the brand illustration rather than a job.

### Section rhythm
One vertical padding for every content section on every page: `py-14 md:py-20` (56px phone, 80px desktop). Measured drift on desktop: 80px (26 sections), 112px (20 sections: the default in shared components, used by home, FAQ, booking form, how-it-works), 96px (blog), 64px (/projects clips). Make them all 80px on desktop: change the DEFAULT in the shared section components from `py-20 md:py-28` to `py-14 md:py-20`. Keep the existing phone-only tightening the two ad templates get through their `compact` prop. Navy bands: `py-14 md:py-16` (64px), both `CTABand` and `ClosingBand`; measured drift 64px vs 56px, and their headings 38px vs 34px: make both bands 64px with a 38px heading. Strips under the hero and thin utility bands: `py-10 md:py-12`. Backgrounds alternate `bg-paper` and `bg-paper-2 border-t border-line`; never two of the same in a row.

