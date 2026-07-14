import { motion, useReducedMotion } from 'framer-motion'
import { useStartedHidden } from '../../lib/hooks'

/**
 * Scroll-into-view reveal. Renders statically under reduced motion — and when
 * mounted into a hidden tab, where paused rAF would freeze the animation at
 * opacity 0 and leave the content invisible.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 36,
  once = true,
  className = '',
  as = 'div',
}) {
  const reduced = useReducedMotion()
  const startedHidden = useStartedHidden()
  const Component = motion[as] || motion.div
  if (reduced || startedHidden) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
