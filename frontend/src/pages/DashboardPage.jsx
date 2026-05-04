import { useMemo, useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { GlobalContext } from '../context/Context' // Path as per your structure
import Card from '../components/Card'
import Button from '../components/Button'
import Skeleton from '../components/Skeleton'

function Stat({ label, value, hint }) {
  return (
    <Card title={label} interactive className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10" />
      <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hint}</p> : null}
    </Card>
  )
}

function DashboardPage() {
  // Pehle Context se state nikalien
  const { state } = useContext(GlobalContext)
  
  // Ab state ke andar se values nikalien (Safe handling ke saath)
  const user = state?.user
  const role = user?.role || 'Admin' // Default role as fallback
  const jobs = state?.jobs || []
  const loading = state?.loading

  const [activities, setActivities] = useState([])

  // 1. Scoped Jobs Logic
  const scopedJobs = useMemo(() => {
    if (!jobs) return []
    if (role === 'Technician') {
      // Backend mein user ki ID 'id' ya '_id' ho sakti hai, dono check kar rahe hain
      const userId = user?.id || user?._id
      return jobs.filter((j) => j.assignedTechnician?._id === userId || j.assignedTechnician === userId)
    }
    if (role === 'Client') {
      const userId = user?.id || user?._id
      return jobs.filter((j) => j.client?._id === userId || j.client === userId)
    }
    return jobs // Admin sees all
  }, [jobs, role, user])

  // 2. Stats Calculation
  const total = scopedJobs.length
  const pending = scopedJobs.filter((j) => j.status === 'pending').length
  const inProgress = scopedJobs.filter((j) => j.status === 'in-progress').length
  const completed = scopedJobs.filter((j) => j.status === 'completed').length
//   const token = localStorage.getItem('fieldops_token')
// console.log("token", token)
  // 3. Fetch Recent Activity
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = user.token
        if (!token) return;

        const res = await axios.get(`${state.baseUrl}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Backend response structure ke mutabiq res.data ya res.data.data
        setActivities(Array.isArray(res.data) ? res.data : res.data.data || [])
      } catch (err) {
        console.error("Activity fetch error", err)
      }
    }
    if (state.baseUrl) {
        fetchActivity()
    }
  }, [state.baseUrl])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    )
  }

  // Technician View
  if (role === 'Technician') {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Technician overview</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Your assigned work, status, and quick updates.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Assigned" value={total} hint="Jobs currently routed to you." />
          <Stat label="In progress" value={inProgress} hint="Active field work." />
          <Stat label="Completed" value={completed} hint="Closed jobs." />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Next up" interactive>
            {scopedJobs.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">You’re all caught up — no assigned jobs.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {scopedJobs.slice(0, 4).map((j) => (
                  <li key={j._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/30">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{j.title}</p>
                      <p className="text-xs text-slate-500 uppercase">{j.status}</p>
                    </div>
                    <Link to={`/jobs/${j._id}`} className="text-xs font-semibold text-[#0f2d5f] dark:text-indigo-300">
                      Open
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Quick updates" interactive>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">Micro-actions for common field workflows.</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/jobs">
                <Button>View jobs</Button>
              </Link>
              <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Scroll top
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Client View
  if (role === 'Client') {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Your operations</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">A clean view of the work happening on your sites.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="My jobs" value={total} hint="All jobs associated with your account." />
          <Stat label="In progress" value={inProgress} hint="Technicians are actively on-site." />
          <Stat label="Completed" value={completed} hint="Recently closed work orders." />
        </div>

        <Card title="Highlights" interactive>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Transparency</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Track timelines, notes, and status changes in one place.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Need something?</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Open a job and leave a note — our team gets notified.</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Admin View
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Admin command center</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Operational health across technicians, clients, and schedules.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/jobs/create">
            <Button>Create job</Button>
          </Link>
          <Link to="/jobs">
            <Button variant="secondary">Browse jobs</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total jobs" value={total} hint="Across all clients and sites." />
        <Stat label="Pending" value={pending} hint="Needs assignment or scheduling." />
        <Stat label="Completed" value={completed} hint="Closed work orders." />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Recent activity" interactive>
          <ul className="space-y-3">
            {activities && activities.length > 0 ? activities.slice(0, 5).map((item) => (
              <motion.li
                key={item._id}
                initial={false}
                whileHover={{ x: 2 }}
                className="rounded-2xl border border-slate-200 bg-white/60 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/30"
              >
                <p className="text-slate-900 dark:text-white">
                  <span className="font-semibold">Update:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-300">{item.message}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </motion.li>
            )) : <p className="text-sm text-slate-500">No recent activity.</p>}
          </ul>
        </Card>

        <Card title="Quick actions" interactive>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/jobs/create" className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0f2d5f] to-indigo-700 p-4 text-white shadow-sm dark:border-slate-800">
              <p className="text-sm font-semibold">Create job</p>
              <p className="mt-1 text-xs text-white/80">Capture scope, schedule, and assign a technician.</p>
            </Link>
            <Link
              to="/notifications"
              className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
            >
              <p className="text-sm font-semibold">Review notifications</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Check latest updates from the field.</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage