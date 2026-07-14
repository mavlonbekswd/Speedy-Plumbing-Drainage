Create a premium, cinematic, modern, multi-page plumbing website for a UK company called **Speedy Plumbing & Drainage**.

This must not look like a basic local business template.

The website should feel like a high-end modern digital experience with:

* Oversized typography
* Large full-width photography
* Cinematic layouts
* Realistic 3D backgrounds
* Scroll-driven animation
* Smooth page transitions
* Premium dark and light sections
* Strong mobile conversion
* Modern editorial-style composition

The main goal is still customer acquisition, phone calls, WhatsApp messages and quote requests.

The design must balance visual impact with speed, usability and trust.

## Core Technology

Use:

* React
* Vite
* Tailwind CSS
* React Router
* Framer Motion
* GSAP with ScrollTrigger
* Three.js
* React Three Fiber
* Drei
* Lenis or another lightweight smooth-scroll solution
* Lucide React icons

Do not use unnecessary libraries.

The 3D experience must use progressive enhancement so the website still works correctly when WebGL is unavailable or disabled.

## Visual Direction

The website should feel inspired by premium architecture, automotive and technology websites.

The style should be:

* Cinematic
* Sophisticated
* Industrial
* Realistic
* Clean
* Bold
* Minimal
* High contrast
* Modern British service brand

Avoid:

* Cartoon illustrations
* Colourful childish graphics
* Fake water splashes
* Unrealistic floating plumbing tools
* Overly glossy 3D objects
* Cheap gradients
* Excessive glassmorphism
* Generic stock-template layouts
* Too many animated elements at the same time

Use large spacing and strong visual hierarchy.

Typography should include:

* Very large hero headlines
* Oversized section titles
* Clear condensed or geometric headings
* Simple readable body text
* Responsive font sizing using `clamp()`

Example hero headline:

“Plumbing Problems Don’t Wait.”

Supporting headline:

“Fast, professional plumbing and drainage services across Cambridge.”

## Colour System

Use a premium colour palette:

* Near-black charcoal
* Deep navy
* Steel grey
* Clean white
* Cool blue
* Electric blue for highlights
* Warm amber only for emergency actions

The colours must feel premium and controlled.

Do not make the entire website bright blue.

## Hero Section

Create a full-screen cinematic hero section.

Include:

* Large background image or video showing a realistic modern plumbing environment
* Dark image overlay
* Huge headline occupying a large part of the screen
* Short supporting text
* Call Now button
* Get a Quote button
* Emergency availability indicator
* Scroll indicator

The visual may include:

* Realistic metal pipework
* Water reflections
* Modern bathroom surfaces
* Industrial plumbing systems
* Wet concrete texture
* Stainless steel fittings

The background must not look like a cartoon or gaming scene.

Add subtle 3D depth between foreground text and the background.

As the user moves the mouse or tilts a mobile device, the background may respond slightly with parallax.

Keep movement subtle.

## Realistic 3D Scroll Experience

Create a realistic 3D background scene that changes as the user scrolls.

The 3D sequence should feel like one continuous visual story.

Possible concept:

A realistic pipe system runs through the website background.

As the user scrolls:

1. The camera slowly moves through a dark metallic pipe environment.
2. Water moves naturally inside a transparent pipe section.
3. The camera passes valves and pipe joints.
4. A blocked pipe becomes visible.
5. The blockage gradually clears.
6. The water flow becomes smooth again.
7. The final scene transitions into a clean modern bathroom or drainage environment.

The animation must communicate the company’s service rather than exist only as decoration.

The pipe system should use:

* Realistic metallic textures
* Controlled reflections
* Physically based materials
* Soft shadows
* Natural lighting
* Realistic water movement
* Depth of field used carefully
* Subtle camera motion

Do not create a cartoon pipe maze.

Do not use exaggerated colours.

Do not rotate objects rapidly.

Do not make the website feel like a video game.

## Scroll Animation Behaviour

Use GSAP ScrollTrigger to connect scrolling to animation progress.

The user’s scroll should control:

* Camera position
* Camera depth
* Pipe movement
* Light direction
* Section transitions
* Text entrance
* Image masks
* Background depth
* Water flow animation

Animations should be smooth and reversible when scrolling upward.

Use pinned sections only where they improve storytelling.

Do not pin every section.

Text must remain readable while the background moves.

Add dark overlays behind text when necessary.

## Mobile 3D Behaviour

Mobile performance is a critical requirement.

On mobile:

* Reduce polygon count
* Reduce texture resolution
* Disable expensive shadows
* Reduce particle counts
* Reduce post-processing
* Limit device pixel ratio
* Pause rendering when the 3D section is outside the viewport
* Use simpler camera movements
* Provide a static image fallback for weak devices
* Disable non-essential animation when battery-saving mode is detected where possible

Do not load the full desktop 3D scene on every phone.

The site must remain fast enough for a customer in an emergency.

## Background Transition Ideas

Use cinematic transitions between sections.

Examples:

* Water ripple mask revealing the next section
* Large image slowly zooming while scrolling
* Pipe moving behind the text
* Dark industrial background transitioning into a bright bathroom
* Vertical text reveal
* Large typography moving at different scroll speeds
* Image clipping masks
* Text appearing from behind foreground objects
* Horizontal project gallery controlled by vertical scroll
* Background lighting changing based on the selected service

Animations must feel intentional and premium.

## Homepage Structure

### 1. Cinematic Hero

Full-screen background with realistic plumbing imagery or 3D pipe scene.

Include:

* Huge headline
* Emergency call button
* Quote button
* Cambridge service location
* Availability status
* Trust indicator

### 2. Problem Introduction

Use a large editorial layout.

Example headline:

“Leaks. Blockages. Low Pressure. We Fix the Problem at Its Source.”

Each problem appears as the user scrolls.

The 3D pipe background should react to each problem.

### 3. Main Services

Use large service sections rather than small basic cards.

Each service should occupy a large portion of the screen.

Alternate layouts:

* Large image on the left, text on the right
* Full-width background image with text overlay
* Large typography with a floating realistic object
* Dark section with 3D pipe detail

Services:

* Emergency Plumbing
* Blocked Drains
* Leak Detection
* Drain Cleaning
* Toilet Repairs
* Bathroom Plumbing

### 4. Emergency Section

Create a dramatic dark section.

Example headline:

“When Water Won’t Stop, Neither Do We.”

Include:

* Call Now button
* Phone number
* Problems handled
* Clear emergency instructions
* Cambridge coverage

Use warm amber only in this emergency section.

### 5. Scroll Story Section

Create a pinned cinematic section explaining the process.

As the user scrolls:

1. Customer reports the issue
2. Problem is inspected
3. Cause is identified
4. Repair is completed
5. Area is cleaned
6. Customer receives clear guidance

Use large text and realistic visuals.

### 6. Before and After

Create a large before-and-after comparison section.

Use:

* Full-screen images
* Drag comparison slider
* Project details
* Work completed
* Location
* Completion time placeholder

### 7. Why Choose Us

Avoid basic icon cards.

Use a large asymmetric grid with:

* Fast communication
* Clear pricing
* Local service
* Respectful work
* Professional equipment
* Clean finish

Each block may animate slightly on scroll.

### 8. Customer Reviews

Create a premium horizontal review carousel.

Use genuine-review placeholders only.

Include:

* Customer name
* Location
* Service
* Rating
* Review
* Google review link placeholder

Do not invent reviews and present them as real.

### 9. Areas Covered

Use a stylised Cambridge-area map.

Locations should animate into view.

Include:

* Cambridge
* Chesterton
* Cherry Hinton
* Trumpington
* Milton
* Histon
* Girton
* Fulbourn
* Waterbeach
* Cambourne
* Sawston
* Ely
* Newmarket

### 10. Final CTA

Create a strong full-screen final section.

Example headline:

“Need a Plumber Today?”

Include:

* Call Now
* WhatsApp
* Request a Quote
* Phone number
* Service area
* Availability

Use a realistic background image with subtle camera movement.

## Photography Direction

Use high-quality realistic images.

Images should show:

* Real plumbing work
* Modern bathrooms
* Professional tools
* Real pipe systems
* Drainage work
* Clean uniforms
* Professional vehicles
* Real homes and commercial environments

Avoid:

* People pointing at pipes
* Fake smiling stock plumbers
* Overly staged corporate photos
* Cartoon illustrations
* Unrealistic AI-looking hands
* Images with fake text or logos

Use large landscape images and full-screen crops.

## Multi-Page Structure

Create:

* Home
* Services
* Emergency Plumbing
* Drainage
* Blocked Drains
* Leak Repairs
* Drain Cleaning
* Toilet Repairs
* Bathroom Plumbing
* Projects
* Areas We Cover
* About
* Reviews
* FAQs
* Blog
* Contact
* Request a Quote

Each page must continue the same premium visual language.

Do not make only the homepage modern while leaving internal pages basic.

## Page Transitions

Add subtle page transitions using Framer Motion.

Transitions may include:

* Black overlay slide
* Image mask reveal
* Fade with vertical movement
* Large page title transition

Transitions must be fast and must not block navigation.

## Navigation

Create a transparent navigation over the hero.

When scrolling:

* The navigation becomes a dark or blurred compact header
* Logo remains visible
* Call Now button stays prominent
* Mobile menu uses a full-screen premium overlay

Mobile navigation should include:

* Services
* Emergency
* Areas
* Projects
* About
* Contact
* Call Now
* Get Quote

## Mobile Bottom Contact Bar

Add a fixed mobile contact bar with:

* Call
* WhatsApp
* Get Quote

It must be visible but not cover content.

Use clear touch targets and short labels.

## Quote Form

Create a clean multi-step quote form.

Steps:

1. Select the problem
2. Select urgency
3. Add postcode
4. Add problem details
5. Upload optional photos
6. Add contact details
7. Submit request

Add:

* Progress indicator
* Validation
* Loading state
* Success state
* Mobile-friendly inputs
* Privacy consent
* Spam protection placeholder

## Performance Requirements

The visual experience must not destroy performance.

Implement:

* Lazy-loaded 3D scenes
* Route-based code splitting
* Compressed GLB models
* Draco compression
* KTX2 compressed textures
* WebP and AVIF images
* Responsive image sizes
* Dynamic imports
* Suspense fallback
* Render-on-demand where possible
* Texture size limits
* Mobile-specific assets
* Reduced motion mode
* Static fallback images

Target:

* Fast first contentful paint
* No layout shift
* Responsive controls
* Smooth scrolling
* No freezing on mobile
* No console errors

The primary Call Now button must be usable before the 3D scene finishes loading.

## Accessibility

Include:

* `prefers-reduced-motion` support
* Keyboard navigation
* Clear focus states
* High contrast
* Semantic HTML
* Accessible forms
* Descriptive alt text
* Large mobile touch targets
* Screen-reader labels
* Animation alternatives

When reduced motion is enabled:

* Disable camera movement
* Disable parallax
* Replace 3D scroll scenes with static images
* Keep content and navigation fully functional

## SEO

Implement:

* LocalBusiness schema
* Plumber schema
* Service schema
* FAQ schema
* Breadcrumb schema
* Unique metadata
* Canonical URLs
* Open Graph tags
* Sitemap
* robots.txt
* Internal links
* Cambridge local SEO
* Unique service-page content

Do not hide SEO content inside animations.

Important headings and paragraphs must exist in the HTML and not only inside the canvas.

## Content Management

Store the following inside editable data or config files:

* Business details
* Phone number
* WhatsApp number
* Email
* Opening hours
* Service areas
* Services
* Reviews
* Projects
* FAQs
* Social links

Avoid hardcoding repeated information across components.

## Final Design Standard

The final website must feel like a premium digital experience for a serious modern service company.

It should combine:

* Large typography
* Cinematic photography
* Realistic 3D
* Scroll storytelling
* Fast mobile contact
* Strong local trust
* Clear service information
* High conversion

The website should look impressive, but customers must never become confused about:

* What the company does
* Which locations are covered
* How to call
* How to request a quote

Before writing code, first present:

1. Creative design concept
2. 3D scroll story
3. Homepage wireframe
4. Mobile layout strategy
5. Animation system
6. Performance strategy
7. Folder structure
8. Required 3D assets
9. Required photography
10. Component architecture

Then build the project section by section.

Do not create a generic template.

Do not replace the realistic 3D direction with simple floating cards or abstract blobs.
