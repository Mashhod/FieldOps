import { motion } from 'framer-motion'

function Card({ title, action, children, className = '', interactive = false }) {
  const Comp = interactive ? motion.section : 'section'
  const motionProps = interactive
    ? { whileHover: { y: -2 }, transition: { type: 'spring', stiffness: 380, damping: 26 } }
    : {}

  return (
    <Comp
      {...motionProps}
      className={`rounded-2xl border border-[var(--card-border)] bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          {action}
        </header>
      )}
      {children}
    </Comp>
  )
}

export default Card
