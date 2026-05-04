const colorMap = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
}

const labelMap = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
}

function StatusBadge({ status }) {
  const label = labelMap[status] || status
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorMap[status] || 'bg-slate-100 text-slate-600'}`}>{label}</span>
}

export default StatusBadge
