import { useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
// Naya import path (Dhyan rakhein ke path sahi ho)
import { useAuth } from '../context/Context.jsx' 
import { mockNotifications } from '../data/mockData'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  
  // Naye context se state aur dispatch nikalna
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()

  // Login status check karna
  if (!state.isLogin) {
    return <Navigate to="/login" replace />
  }

  // User aur Role nikalna
  const user = state.user
  const role = user?.role || 'Admin'

  const handleLogout = () => {
    // Reducer ke mutabiq logout action
    dispatch({ type: "USER_LOGOUT" })
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
      <div className="flex">
        {/* Sidebar ko sahi props pass karna */}
        <Sidebar 
          open={sidebarOpen} 
          role={role} 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
        />
        
        <main className={`min-h-screen flex-1 transition-[padding] duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-[84px]'}`}>
          {/* Navbar ko context ka user aur logout function dena */}
          <Navbar 
            user={user} 
            onLogout={handleLogout} 
            notifications={notifications} 
            setNotifications={setNotifications} 
          />
          
          <div className="p-4 lg:p-6">
            <div className="mb-3 flex gap-2">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 lg:hidden"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-[#0f2d5f]" />
                Menu
              </button>
              
              {/* Desktop Toggle Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 lg:inline-flex"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                {sidebarOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {/* Saare child routes yahan render honge */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout