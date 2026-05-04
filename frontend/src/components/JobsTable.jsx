import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'

function JobsTable({ jobs }) {
  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-slate-500 dark:text-slate-300">
          <tr>
            <th className="py-3">Title</th>
            <th className="py-3">Status</th>
            <th className="py-3">Technician</th>
            <th className="py-3">Date</th>
            <th className="py-3 text-right"> </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <motion.tr
              key={job.id}
              initial={false}
              whileHover={{ backgroundColor: 'rgba(148, 163, 184, 0.12)' }}
              className="border-t border-slate-200 dark:border-slate-800"
            >
              <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                <Link to={`/jobs/${job.id}`} className="hover:underline">
                  {job.title}
                </Link>
              </td>
              <td className="py-3">
                <StatusBadge status={job.status} />
              </td>
              <td className="py-3 text-slate-600 dark:text-slate-300">{job.technician}</td>
              <td className="py-3 text-slate-600 dark:text-slate-300">{job.date}</td>
              <td className="py-3 text-right">
                <Link to={`/jobs/${job.id}`} className="text-xs font-semibold text-[#0f2d5f] dark:text-indigo-300">
                  Details
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JobsTable
