import Reveal from './Reveal'

/**
 * Oversized editorial section heading with eyebrow and optional intro text.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  dark = true,
  size = 'display-xl',
  className = '',
}) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={`max-w-5xl ${alignCls} ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className={`eyebrow mb-5 ${dark ? 'text-electric' : 'text-blue'}`}>{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className={`${size} ${dark ? 'text-white' : 'text-charcoal'}`}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${dark ? 'text-steel' : 'text-steel-dark'} ${align === 'center' ? 'mx-auto' : ''}`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  )
}
