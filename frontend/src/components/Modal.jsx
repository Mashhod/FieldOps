import { motion, AnimatePresence } from 'framer-motion'

function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900"
          >
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
