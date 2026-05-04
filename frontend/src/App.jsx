import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoginRoute from './pages/LoginRoute'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import CreateJobPage from './pages/CreateJobPage'
import NotificationsPage from './pages/NotificationsPage'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import PageTransition from './components/PageTransition'

function AnimatedLayoutOutlet() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<AnimatedLayoutOutlet />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<AnimatedLayoutOutlet />}>
              <Route path="/jobs/create" element={<CreateJobPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
