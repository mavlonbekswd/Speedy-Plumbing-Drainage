import { Link } from 'react-router-dom'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { businessConfig } from '../../data/business'

/**
 * Fixed mobile contact bar: Call · Email · Get Quote (per confirmed contact
 * details in Contact.md). If a WhatsApp link is later confirmed in
 * businessConfig, it replaces Email automatically (email stays available in
 * the navigation and footer).
 */
export default function MobileContactBar() {
  const middle = businessConfig.whatsappHref
    ? {
        href: businessConfig.whatsappHref,
        label: 'WhatsApp',
        icon: MessageCircle,
        external: true,
      }
    : { href: businessConfig.emailHref, label: 'Email', icon: Mail }
  const MiddleIcon = middle.icon

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-charcoal/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a
        href={businessConfig.phoneHref}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 bg-electric text-charcoal"
      >
        <Phone className="size-4.5" aria-hidden="true" />
        <span className="text-[11px] font-bold tracking-wider uppercase">Call</span>
      </a>
      <a
        href={middle.href}
        {...(middle.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-white"
      >
        <MiddleIcon className="size-4.5" aria-hidden="true" />
        <span className="text-[11px] font-bold tracking-wider uppercase">{middle.label}</span>
      </a>
      <Link
        to="/quote"
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-l border-white/10 text-white"
      >
        <span className="text-base leading-none font-bold text-electric" aria-hidden="true">
          £
        </span>
        <span className="text-[11px] font-bold tracking-wider uppercase">Get Quote</span>
      </Link>
    </nav>
  )
}
