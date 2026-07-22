import { useState } from 'react'

function variantPath(image, width, extension) {
  const suffix = width === image.width ? '' : `-${width}`
  return `${image.basePath}${suffix}.${extension}`
}

function srcSet(image, extension) {
  return image.widths
    .map((width) => `${variantPath(image, width, extension)} ${width}w`)
    .join(', ')
}

export default function ResponsiveImage({
  image,
  alt = image.alt,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  priority = false,
  draggable,
}) {
  const [failed, setFailed] = useState(false)

  function handleError() {
    if (import.meta.env.DEV) {
      console.warn(`[ResponsiveImage] Failed to load ${image.basePath}`)
    }
    setFailed(true)
  }

  if (failed) {
    return (
      <div
        className={`relative overflow-hidden bg-navy ${className}`}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(56,189,248,0.18),transparent_48%)]" />
        <span className="absolute right-[18%] bottom-[18%] h-1/3 w-1/2 rounded-full border border-electric/20" />
      </div>
    )
  }

  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet(image, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, 'webp')} sizes={sizes} />
      <img
        src={`${image.basePath}.webp`}
        srcSet={srcSet(image, 'webp')}
        sizes={sizes}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : loading}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={draggable}
        className={className}
        style={{ objectPosition: image.objectPosition }}
        onError={handleError}
      />
    </picture>
  )
}
