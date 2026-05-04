import { useMemo, useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios' // Axios import kiya integration ke liye
import { GlobalContext } from '../context/Context'
import Card from '../components/Card'
import JobsTable from '../components/JobsTable'
import Input from '../components/Input'
import Skeleton from '../components/Skeleton'
import StatusBadge from '../components/StatusBadge'

function JobsPage() {
  const { state, dispatch } = useContext(GlobalContext);
  const { jobs, loading, user, baseUrl } = state;
  const role = user?.role?.toLowerCase();

  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  // 1. API Logic: Jobs fetch karne ka function
  const fetchJobs = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token = localStorage.getItem('fieldops_token'); // Auth token lena
      const response = await axios.get(`${baseUrl}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response)
      // Data ko context mein save karna
      dispatch({ type: "SET_JOBS", payload: response.data.Jobs });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // 2. Initial Data Fetch on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Frontend filtering logic (Search aur Status dropdown ke liye)
  const filtered = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase().trim());
      return matchesStatus && matchesQuery;
    });
  }, [jobs, statusFilter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Jobs</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
             {role === 'admin' ? "Managing all field operations." : "Viewing your service requests."}
          </p>
        </div>
        
        {/* Only Admin can see Create Job button */}
        {role === 'admin' && (
          <Link to="/jobs/create">
            <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex">
              <span className="rounded-xl bg-[#0f2d5f] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                Create job
              </span>
            </motion.span>
          </Link>
        )}
      </div>

      <Card title="Pipeline">
        <div className="mb-4 grid gap-3 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Input label="Search" placeholder="Search by title..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center dark:border-slate-700 dark:bg-slate-950/30">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">No jobs found</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Try adjusting filters or refresh the page.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <JobsTable jobs={filtered} />
            </div>

            {/* Mobile View */}
            <div className="grid gap-3 lg:hidden">
              <AnimatePresence initial={false}>
                {filtered.map((job) => (
                  <motion.div key={job._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="block rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{job.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(job.createdAt).toLocaleDateString()} · {job.assignedTechnician?.name || 'Unassigned'}
                          </p>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default JobsPage