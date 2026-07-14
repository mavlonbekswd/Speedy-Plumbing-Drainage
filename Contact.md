Update the existing plumbing website using the following confirmed business information.

## Confirmed Business Information

Business name:

**Speedy Plumbing & Drain**

Email:

**[Speedyplumbing01@gmail.com](mailto:Speedyplumbing01@gmail.com)**

Telephone:

**01223 482415**

Use the formatted phone number `01223 482415` for visible website text.

Use the following clickable phone link in the code:

```text
tel:+441223482415
```

Use the following clickable email link:

```text
mailto:Speedyplumbing01@gmail.com
```

Replace every old placeholder and every previous variation of the business name with:

**Speedy Plumbing & Drain**

Do not use “Speedy Plumbing & Drainage” unless it is specifically required later.

Store all business information in one central configuration file rather than repeating it manually throughout the website.

Example structure:

```js
export const businessConfig = {
  name: "Speedy Plumbing & Drain",
  phoneDisplay: "01223 482415",
  phoneHref: "tel:+441223482415",
  email: "Speedyplumbing01@gmail.com",
  emailHref: "mailto:Speedyplumbing01@gmail.com",
};
```

## Confirmed Service Areas

Speedy Plumbing & Drain provides services across the following locations:

1. Cambridge
2. Ely
3. Huntingdon
4. Royston and the SG8 area
5. Haverhill and the CB9 area
6. Newmarket and the CB8 area
7. Milton
8. Fulbourn
9. Cottenham
10. Impington
11. Waterbeach
12. Sawston and the CB22 area
13. St Neots and the PE19 area
14. Cambourne and the CB23 area
15. Great Shelford
16. Cherry Hinton and the CB1 area
17. Little Shelford and the CB22 5HL area

Store these locations inside a reusable data file.

Example:

```js
export const serviceAreas = [
  {
    name: "Cambridge",
    displayName: "Cambridge, UK",
    slug: "cambridge",
  },
  {
    name: "Ely",
    displayName: "Ely, UK",
    slug: "ely",
  },
  {
    name: "Huntingdon",
    displayName: "Huntingdon, UK",
    slug: "huntingdon",
  },
  {
    name: "Royston",
    displayName: "Royston, SG8",
    slug: "royston",
  },
  {
    name: "Haverhill",
    displayName: "Haverhill, CB9",
    slug: "haverhill",
  },
  {
    name: "Newmarket",
    displayName: "Newmarket, CB8",
    slug: "newmarket",
  },
  {
    name: "Milton",
    displayName: "Milton, Cambridge",
    slug: "milton",
  },
  {
    name: "Fulbourn",
    displayName: "Fulbourn, Cambridge",
    slug: "fulbourn",
  },
  {
    name: "Cottenham",
    displayName: "Cottenham, Cambridge",
    slug: "cottenham",
  },
  {
    name: "Impington",
    displayName: "Impington, Cambridge",
    slug: "impington",
  },
  {
    name: "Waterbeach",
    displayName: "Waterbeach, Cambridge",
    slug: "waterbeach",
  },
  {
    name: "Sawston",
    displayName: "Sawston, CB22",
    slug: "sawston",
  },
  {
    name: "St Neots",
    displayName: "St Neots, PE19",
    slug: "st-neots",
  },
  {
    name: "Cambourne",
    displayName: "Cambourne, CB23",
    slug: "cambourne",
  },
  {
    name: "Great Shelford",
    displayName: "Great Shelford, Cambridge",
    slug: "great-shelford",
  },
  {
    name: "Cherry Hinton",
    displayName: "Cherry Hinton, CB1",
    slug: "cherry-hinton",
  },
  {
    name: "Little Shelford",
    displayName: "Little Shelford, CB22 5HL",
    slug: "little-shelford",
  },
];
```

## Important Accuracy Rule

These locations are **service areas**, not separate business offices.

Do not:

* Show them as physical branches
* Add fake office addresses
* Add fake Google Maps pins suggesting there is an office in every town
* Claim “local office in Ely” or “our Huntingdon branch”
* Create false address schema for these locations

Use wording such as:

* “Areas We Cover”
* “Plumbing and drainage services across Cambridge and surrounding areas”
* “Serving homes and businesses throughout Cambridgeshire and nearby towns”
* “Check whether we cover your postcode”

## Homepage Updates

Add a premium service-area section to the homepage.

Suggested heading:

**Professional Plumbing Across Cambridge and Surrounding Areas**

Suggested paragraph:

“Speedy Plumbing & Drain provides reliable plumbing and drainage services across Cambridge, Ely, Huntingdon, Newmarket, St Neots, Haverhill and surrounding communities.”

Show the locations using a modern responsive layout.

Do not use small, basic-looking tags only.

Create a premium section using:

* Large typography
* A dark or cinematic background
* Subtle animated map lines
* Location names appearing during scroll
* A stylised Cambridge and Cambridgeshire map
* Soft pulsing location points
* A postcode-check call-to-action

The map should be visually stylised and must not imply exact office locations.

Add the following CTA:

**Not sure whether we cover your area? Call 01223 482415**

The phone number must be clickable.

## Areas We Cover Page

Create or update a dedicated page at:

```text
/areas-we-cover
```

Page headline:

**Plumbing and Drainage Services Across Cambridge and Surrounding Areas**

Supporting text:

“From central Cambridge to Ely, Huntingdon, Newmarket, Haverhill, St Neots and nearby villages, our team provides professional plumbing and drainage services across the region.”

Organise the service areas into logical groups.

### Cambridge

* Cambridge
* Cherry Hinton
* Milton
* Fulbourn
* Cottenham
* Impington
* Waterbeach
* Great Shelford
* Little Shelford

### South and West Cambridgeshire

* Sawston
* Cambourne
* Royston

### Surrounding Towns

* Ely
* Huntingdon
* Newmarket
* Haverhill
* St Neots

Add a postcode checker interface containing:

* Postcode input
* “Check Coverage” button
* Loading state
* Supported-area result
* Area-not-confirmed result
* Call-us fallback

Until a real postcode API is connected, clearly treat this as a frontend demonstration. Do not create false coverage validation.

For an unconfirmed postcode, show:

“Your area may still be covered. Please call us on 01223 482415 to confirm.”

## Contact Information Placement

Display the confirmed phone number and email in:

* Main navigation
* Mobile navigation
* Hero call-to-action
* Emergency section
* Contact page
* Quote form
* Mobile sticky contact bar
* Footer
* Areas We Cover page
* Service pages
* Structured data

On mobile, create a fixed contact bar containing:

* Call
* Email
* Request a Quote

The Call button must use:

```text
tel:+441223482415
```

The Email button must use:

```text
mailto:Speedyplumbing01@gmail.com
```

## Contact Page

Use the following content:

Business:

**Speedy Plumbing & Drain**

Telephone:

**01223 482415**

Email:

**[Speedyplumbing01@gmail.com](mailto:Speedyplumbing01@gmail.com)**

Do not add a physical address until a confirmed business address is provided.

Do not invent opening hours.

If opening hours have not been supplied, use an editable placeholder in the admin configuration, but do not display fake hours publicly.

Do not claim “24/7” unless confirmed by the business owner.

## Quote Form Updates

Add a required postcode field.

When a customer enters a postcode, store it as part of the enquiry.

The form should include:

* Service required
* Urgency
* Full name
* Telephone number
* Email address
* Postcode
* Problem description
* Optional image upload
* Preferred contact method
* Privacy consent

After successful submission, display:

“Thank you. Speedy Plumbing & Drain has received your request. Our team will contact you using the details provided.”

Do not promise a specific response time unless confirmed.

## Local SEO

Naturally target location-based searches such as:

* Plumber Cambridge
* Emergency plumber Cambridge
* Drainage services Cambridge
* Plumber Ely
* Plumber Huntingdon
* Plumber Newmarket
* Plumber Haverhill
* Plumber St Neots
* Plumber Royston
* Plumber Cambourne
* Plumber Sawston
* Blocked drains Cambridge
* Leak repair Cambridge

Do not stuff every location into every paragraph.

Create genuinely useful location content and internal links.

Do not automatically generate thin, nearly identical pages for every location.

Initially create strong content for:

* Cambridge
* Ely
* Huntingdon
* Newmarket
* Haverhill
* St Neots

Use a reusable location-page template, but ensure each published page has unique and meaningful content.

## Structured Data

Update the LocalBusiness and Plumber structured data with:

```json
{
  "name": "Speedy Plumbing & Drain",
  "telephone": "+441223482415",
  "email": "Speedyplumbing01@gmail.com"
}
```

Add the service areas using `areaServed`.

Do not add an address field until a genuine business address has been supplied.

Do not add fake ratings, review counts, opening hours, prices, awards or certifications.

## Footer Content

Use:

**Speedy Plumbing & Drain**

“Professional plumbing and drainage services across Cambridge and surrounding areas.”

Contact:

* 01223 482415
* [Speedyplumbing01@gmail.com](mailto:Speedyplumbing01@gmail.com)

Show a concise selection of key areas:

* Cambridge
* Ely
* Huntingdon
* Newmarket
* Haverhill
* St Neots

Add a link to the full Areas We Cover page rather than placing all locations inside the footer.

## Final Requirement

Audit the complete project and confirm that:

* The business name is consistent
* The telephone number is consistent
* The email address is consistent
* All phone links work
* All email links work
* Service areas come from one reusable data source
* Locations are not falsely represented as offices
* No fake address has been added
* No unsupported 24/7 claim exists
* No fake qualifications, reviews or guarantees exist
* Mobile users can call the business in one tap
* All pages remain responsive
* The premium design and scroll-animation system remain intact
