import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './Button'
import { useTheme } from '../context/ThemeContext'

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a5 5 0 0 0-5 5v2.34c0 .22-.06.44-.17.63l-.82 1.47c-.35.63.11 1.39.84 1.39h10.3c.73 0 1.19-.76.84-1.39l-.82-1.47a1.2 1.2 0 0 1-.17-.63V8a5 5 0 0 0-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function NotificationsPanel({ notifications, setNotifications }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  useEffect(() => {
    if (!open) return

    function onPointerDown(e) {
      if (!rootRef.current) return
      if (rootRef.current.contains(e.target)) return
      setOpen(false)
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <div className="relative" ref={rootRef}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-12 z-40 w-[min(92vw,22rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
              <Button variant="ghost" className="px-2 py-1 text-xs" onClick={markAllRead} disabled={unreadCount === 0}>
                Mark all read
              </Button>
            </div>
            <div className="max-h-[min(60vh,420px)] space-y-2 overflow-auto pr-1">
              {notifications.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ y: -1 }}
                  onClick={() => setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)))}
                  className={`w-full rounded-xl p-3 text-left text-sm transition ${
                    item.read ? 'bg-slate-50 dark:bg-slate-900/40' : 'bg-indigo-50 dark:bg-indigo-950/30'
                  }`}
                >
                  <p className="text-slate-800 dark:text-slate-100">{item.text}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.at}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Navbar({ user, onLogout, notifications, setNotifications }) {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
        >
          {darkMode ? 'Light mode' : 'Dark mode'}
        </motion.button>
        <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />
        <Button variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Navbar
