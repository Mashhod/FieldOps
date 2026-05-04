function Input({ label, ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
      <span>{label}</span>
      <input
        className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 outline-none transition focus:border-[#0f2d5f] focus:ring-2 focus:ring-[#0f2d5f]/20 dark:border-slate-700 dark:bg-slate-900/70"
        {...props}
      />
    </label>
  )
}

export default Input
