import { useMemo, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { GlobalContext } from '../context/Context.jsx'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'

function CreateJobPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(GlobalContext)
  const { baseUrl } = state

  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    technician: '', 
    date: '', 
    client: '' // Note: Database mein client ID jayegi
  })
  const [errors, setErrors] = useState({})
  const [techList, setTechList] = useState([]) // Backend se aane wale technicians

  // 1. Backend se technicians fetch karna (Dropdown ke liye)
  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const token = localStorage.getItem('fieldops_token')
        // Maan lete hain aapke paas users fetch karne ki API hai
        const res = await axios.get(`${baseUrl}/users?role=Technician`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTechList(res.data.users)
      } catch (err) {
        console.error("Error fetching technicians", err)
      }
    }
    fetchTechs()
  }, [baseUrl])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (!form.description.trim()) nextErrors.description = 'Description helps technicians succeed.'
    if (!form.client.trim()) nextErrors.client = 'Client ID is required.' // Backend expects ObjectId

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    try {
      const token = localStorage.getItem('fieldops_token')
      console.log("Token", token)
      
      // Backend mapping: form.date -> scheduledAt, form.technician -> assignedTechnician
      const jobData = {
        title: form.title.trim(),
        description: form.description.trim(),
        client: form.client.trim(), // Yahan Client ki ID honi chahiye
        assignedTechnician: form.technician || null,
        scheduledAt: form.date || null,
        status: "pending"
      }

      const response = await axios.post(`${baseUrl}/job`, jobData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 201) {
        // Context update (Optional: List refresh karne ke liye)
        dispatch({ type: "ADD_NEW_JOB", payload: response.data.job })
        navigate(`/jobs`, { replace: true })
      }
    } catch (error) {
      console.error("Create Job Error:", error)
      setErrors({ server: error.response?.data?.message || "Internal Server Error" })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Create job</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Capture scope, schedule, and ownership in one clean form.</p>
      </div>

      <Card title="Job details" interactive>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit} noValidate>
          {errors.server && <div className="md:col-span-2 text-rose-600 text-sm bg-rose-50 p-2 rounded-lg">{errors.server}</div>}
          
          <div className="md:col-span-2">
            <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. HVAC Inspection - Tower A" />
            {errors.title ? <p className="mt-2 text-sm text-rose-600">{errors.title}</p> : null}
          </div>

          <div>
            <label className="flex w-full flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
              <span>Assign technician</span>
              <select
                value={form.technician}
                onChange={(e) => update('technician', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 outline-none transition focus:border-[#0f2d5f] focus:ring-2 focus:ring-[#0f2d5f]/20 dark:border-slate-700 dark:bg-slate-900/70"
              >
                <option value="">Select Technician (Optional)</option>
                {techList.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <Input label="Client ID" value={form.client} onChange={(e) => update('client', e.target.value)} placeholder="Enter Client User ID" />
            {errors.client ? <p className="mt-2 text-sm text-rose-600">{errors.client}</p> : null}
          </div>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-slate-600 dark:text-slate-200">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[#0f2d5f] focus:ring-2 focus:ring-[#0f2d5f]/20 dark:border-slate-700 dark:bg-slate-900/70"
              placeholder="Scope, access constraints, parts, safety notes…"
            />
            {errors.description ? <p className="mt-2 text-sm text-rose-600">{errors.description}</p> : null}
          </label>

          <div>
            <Input label="Schedule date" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
            {errors.date ? <p className="mt-2 text-sm text-rose-600">{errors.date}</p> : null}
          </div>

          <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit">Create job</Button>
            </motion.div>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateJobPage