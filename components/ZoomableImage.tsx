import type { ReactNode } from "react";

// The trigger half of the enlarge-a-photo feature. A SERVER component: it renders nothing but a
// button carrying data attributes, and components/PhotoLightbox.tsx (the one client component,
// mounted once in app/layout.tsx) reads those attributes off the DOM. So a gallery stays a
// server component and the page ships no extra JavaScript per tile.
//
// It wraps the PICTURE only, never the caption, and it adds no visual of its own: the tile keeps
// its own rounded corners, border and aspect box on the element inside. The button is block and
// full width so the grid cell measures exactly as it did before, and the focus ring is the
// sitewide :focus-visible outline from app/globals.css, which follows the rounded corners.
//
// Never used for a hero backdrop, a service card (the whole card is already one link), the logo
// or a video poster (components/WorkVideo.tsx owns its own play control).
export default function ZoomableImage({
  src,
  alt,
  caption,
  location,
  children,
}: {
  /** The photo's own file path, for example /work/new-toilet.webp. */
  src: string;
  /** The same alt the thumbnail carries, taken from the data and never rewritten. */
  alt: string;
  /** The visible caption, where the tile has one. */
  caption?: string;
  /** Where the tile sits, for data-cta-location: proof_strip, scene_row, job_photo_row... */
  location: string;
  children: ReactNode;
}) {
  // Spread rather than a literal, so a tile with no caption carries no empty attribute.
  const captionAttribute: Record<string, string> = caption ? { "data-zoom-caption": caption } : {};

  return (
    <button
      type="button"
      data-zoom-src={src}
      data-zoom-alt={alt}
      {...captionAttribute}
      aria-label={`Enlarge photo: ${caption ?? alt}`}
      data-cta="photo"
      data-cta-location={location}
      data-cta-variant="icon_button"
      className="block w-full cursor-zoom-in rounded-card"
    >
      {children}
    </button>
  );
}
