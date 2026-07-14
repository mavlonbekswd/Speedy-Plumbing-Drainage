import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-electric text-charcoal hover:bg-white hover:text-charcoal',
  emergency:
    'bg-amber text-charcoal hover:bg-white hover:text-charcoal',
  outline:
    'border border-white/30 text-white hover:border-electric hover:text-electric bg-transparent',
  dark:
    'bg-charcoal text-white hover:bg-navy border border-white/10',
  light:
    'bg-white text-charcoal hover:bg-electric',
}

const sizes = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

/**
 * Shared CTA button. Renders an <a> for tel:/mailto:/external hrefs,
 * a router <Link> for internal paths, or a <button> otherwise.
 */
export default function Button({
  href,
  to,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2.5 font-semibold tracking-wide uppercase rounded-sm transition-colors duration-300 select-none min-h-12 ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {Icon && <Icon className="size-4.5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </>
  )
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {content}
    </button>
  )
}
