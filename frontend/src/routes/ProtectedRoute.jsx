import { Navigate, Outlet, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
import { GlobalContext } from '../context/Context'
import { useContext } from 'react'

function ProtectedRoute({ children, roles }) {
  // const { isAuthenticated, role } = useAuth()
  const { state } = useContext(GlobalContext)
  const location = useLocation()

  if (!state.isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(state.user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children || <Outlet />
}

export default ProtectedRoute
