import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { reviews, reviewsArePlaceholders, googleReviewsUrl } from '../../data/reviews'

function Stars({ rating }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? 'fill-electric text-electric' : 'text-steel-dark'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/**
 * Horizontal premium review carousel. Reviews are placeholder-flagged until
 * genuine customer reviews are supplied — the sample badge renders while
 * reviewsArePlaceholders is true.
 */
export default function ReviewCarousel() {
  const trackRef = useRef(null)

  function scrollByCard(dir) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('article')
    const amount = (card?.offsetWidth || 360) + 24
    track.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-label="Customer reviews carousel"
      >
        {reviews.map((review, i) => (
          <article
            key={i}
            className="relative w-[85%] max-w-md shrink-0 snap-start rounded-sm border border-white/10 bg-ink p-8 sm:w-[420px]"
          >
            {reviewsArePlaceholders && (
              <span className="absolute top-4 right-4 rounded-sm border border-amber/40 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-amber uppercase">
                Sample review
              </span>
            )}
            <Stars rating={review.rating} />
            <p className="mt-5 text-base leading-relaxed text-mist/90">“{review.text}”</p>
            <footer className="mt-6 border-t border-white/10 pt-4">
              <p className="font-semibold text-white">{review.name}</p>
              <p className="mt-0.5 text-sm text-steel">
                {review.location} · {review.service}
              </p>
            </footer>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous reviews"
            className="flex size-12 items-center justify-center rounded-sm border border-white/15 text-white transition-colors hover:border-electric hover:text-electric"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next reviews"
            className="flex size-12 items-center justify-center rounded-sm border border-white/15 text-white transition-colors hover:border-electric hover:text-electric"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
        {googleReviewsUrl ? (
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-electric underline-offset-4 hover:underline"
          >
            Read our reviews on Google →
          </a>
        ) : (
          <span className="text-xs text-steel/70">Google review link placeholder — added when connected</span>
        )}
      </div>
    </div>
  )
}
