import { useMemo, useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { GlobalContext } from '../context/Context'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Skeleton from '../components/Skeleton'

function JobDetailsPage() {
  const { jobId } = useParams()
  const { state, dispatch } = useContext(GlobalContext)
  const { user, jobs, baseUrl, loading } = state
  const role = user?.role // 'Admin', 'Technician', 'Client'

  const [open, setOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState('')
  const [nextStatus, setNextStatus] = useState('pending')
  const [note, setNote] = useState('')
  const [techList, setTechList] = useState([]) // Technicians dropdown ke liye

  // 1. Find Job from state
  const job = useMemo(() => jobs.find((item) => item._id === jobId), [jobId, jobs])

  // 2. Auth/Access Logic
  const canView = useMemo(() => {
    if (!job || !user) return false
    if (role === 'Admin') return true
    if (role === 'Technician') return job.assignedTechnician?._id === user.id || job.assignedTechnician === user.id
    if (role === 'Client') return job.client?._id === user.id || job.client === user.id
    return false
  }, [job, role, user])

  // 3. Fetch Technicians for Admin Modal
  useEffect(() => {
    if (role === 'Admin') {
      axios.get(`${baseUrl}/users?role=Technician`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('fieldops_token')}` }
      }).then(res => setTechList(res.data.users)).catch(err => console.log(err))
    }
  }, [role, baseUrl])

  // 4. Update Status Logic (API: PUT /api/job/:id/status)
  const handleUpdateStatus = async () => {
    try {
      const res = await axios.put(`${baseUrl}/job/${jobId}/status`, 
        { status: nextStatus, note: "Status changed via dashboard" },
        { headers: { Authorization: `Bearer ${localStorage.getItem('fieldops_token')}` }}
      )
      dispatch({ type: "UPDATE_JOB_STATUS", payload: res.data.data })
      alert("Status updated!")
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status")
    }
  }

  // 5. Assign Technician (API: PUT /api/job/:id)
  const handleAssignTech = async () => {
    try {
      const res = await axios.put(`${baseUrl}/job/${jobId}`, 
        { assignedTechnician: selectedTech },
        { headers: { Authorization: `Bearer ${localStorage.getItem('fieldops_token')}` }}
      )
      dispatch({ type: "UPDATE_JOB_STATUS", payload: res.data.updatedJob })
      setOpen(false)
    } catch (err) {
      alert("Error assigning technician")
    }
  }

  // 6. Add Note (API: PUT /api/job/:id)
  const handleAddNote = async () => {
    if (!note.trim()) return
    try {
      const res = await axios.put(`${baseUrl}/job/${jobId}`, 
        { newNote: note },
        { headers: { Authorization: `Bearer ${localStorage.getItem('fieldops_token')}` }}
      )
      dispatch({ type: "UPDATE_JOB_STATUS", payload: res.data.updatedJob })
      setNote('')
    } catch (err) {
      alert("Error saving note")
    }
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )

  if (!job) return (
    <Card title="Job not found">
      <p className="text-sm text-slate-600 dark:text-slate-300">The job does not exist.</p>
    </Card>
  )

  if (!canView) return (
    <Card title="Restricted">
      <p className="text-sm text-slate-600 dark:text-slate-300">You don’t have access to this job.</p>
    </Card>
  )

  // Timeline logic from backend 'updates' array
  const timeline = job.updates || []

  return (
    <div className="space-y-4">
      <Card title={job.title} interactive action={<StatusBadge status={job.status} />}>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">{job.client?.name || 'Client'}</span> · Scheduled{' '}
              <span className="font-medium text-slate-900 dark:text-white">
                {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString() : 'Not set'}
              </span>
            </p>
            {job.description ? <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{job.description}</p> : null}
            <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/35">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned technician</p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{job.assignedTechnician?.name || 'Unassigned'}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-500/10 via-white/40 to-violet-500/10 p-4 dark:border-slate-800 dark:from-indigo-500/10 dark:via-slate-950/20 dark:to-violet-500/10">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Live status</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Tracking real-time updates for {job.title}.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Status timeline" interactive>
          <ol className="relative space-y-3 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-slate-200 dark:before:bg-slate-800">
            {timeline.length > 0 ? timeline.map((step, idx) => (
                <li key={idx} className="relative pl-8">
                  <span className="absolute left-0 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-bold text-[#0f2d5f] dark:border-slate-800 dark:bg-slate-950">
                    {timeline.length - idx}
                  </span>
                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/35">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{step.status}</p>
                      <p className="text-xs text-slate-500">{new Date(step.updatedAt).toLocaleString()}</p>
                    </div>
                    {step.note ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{step.note}</p> : null}
                  </div>
                </li>
            )) : <p className="text-sm text-slate-500 ml-8">No status updates yet.</p>}
          </ol>
        </Card>

        <Card title="Notes" interactive>
          <div className="space-y-3">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {job.notes?.length > 0 ? job.notes.map((n, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/35">
                   <p className="text-slate-700 dark:text-slate-200">{n.text}</p>
                   <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No notes yet.</p>}
            </div>

            <div className="space-y-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f2d5f] focus:ring-2 focus:ring-[#0f2d5f]/20 dark:border-slate-800 dark:bg-slate-950"
                  placeholder="Leave a short update for the team…"
                />
                <div className="flex justify-end">
                  <Button type="button" onClick={handleAddNote}>Save note</Button>
                </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Actions" interactive>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          {(role === 'Technician' || role === 'Admin') && (
            <div className="flex w-full flex-col gap-2 sm:w-auto">
              <label className="text-sm text-slate-600 dark:text-slate-200">
                Update status
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 sm:w-56"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="sm:w-56">
                <Button className="w-full" type="button" onClick={handleUpdateStatus}>
                  Apply update
                </Button>
              </motion.div>
            </div>
          )}

          {role === 'Admin' && (
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button type="button" onClick={() => setOpen(true)}>
                Assign technician
              </Button>
            </motion.div>
          )}
        </div>
      </Card>

      <Modal open={open} title="Assign technician" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <label className="block text-sm text-slate-600 dark:text-slate-200">
            Technician
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="">Select Tech</option>
              {techList.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAssignTech}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default JobDetailsPage