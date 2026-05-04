import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/jobs/create', label: 'Create Job', adminOnly: true },
]

function Sidebar({ open, role, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <button type="button" aria-label="Close menu" className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <motion.aside
        initial={false}
        animate={{ width: open ? 256 : 84 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`fixed left-0 top-0 z-30 h-screen border-r border-slate-200 bg-white/90 p-3 backdrop-blur transition-transform dark:border-slate-800 dark:bg-slate-950/85 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="mb-7 flex h-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f2d5f] to-indigo-700 text-sm font-semibold text-white shadow-sm">
          {open ? 'FieldOps' : 'FO'}
        </div>
        <nav className="space-y-2">
          {navItems
            .filter((item) => !(item.adminOnly && role !== 'admin'))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={!open ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center ${open ? 'gap-3 px-3' : 'justify-center px-2'} rounded-2xl py-2 text-sm transition ${
                    isActive
                      ? 'bg-[#0f2d5f] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="inline-block h-2 w-2 rounded-full bg-current opacity-90" />
                {open ? <span className="font-medium">{item.label}</span> : <span className="sr-only">{item.label}</span>}
              </NavLink>
            ))}
        </nav>
      </motion.aside>
    </>
  )
}

export default Sidebar
