export default function StatsCard({ icon: Icon, label, value, meta, tone = 'blue' }) {
  const toneMap = {
    blue: {
      accent: 'bg-blue-50 text-blue-600 ring-blue-100',
      value: 'text-slate-900',
    },
    emerald: {
      accent: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
      value: 'text-slate-900',
    },
    amber: {
      accent: 'bg-amber-50 text-amber-600 ring-amber-100',
      value: 'text-slate-900',
    },
    rose: {
      accent: 'bg-rose-50 text-rose-600 ring-rose-100',
      value: 'text-slate-900',
    },
    sky: {
      accent: 'bg-sky-50 text-sky-600 ring-sky-100',
      value: 'text-slate-900',
    },
  }

  const styles = toneMap[tone] || toneMap.blue

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <h3 className={`mt-4 text-3xl font-bold tracking-[-0.06em] ${styles.value}`}>{value}</h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${styles.accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{meta}</p>
    </div>
  )
}
