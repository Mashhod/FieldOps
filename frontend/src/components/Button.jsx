import { motion } from 'framer-motion'

function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#0f2d5f] text-white hover:bg-[#183e7d]',
    secondary: 'bg-white/70 text-slate-700 border border-slate-200 hover:bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  }

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
