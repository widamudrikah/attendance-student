const STATUS_STYLES = {
  hadir: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  izin: 'bg-amber-100 text-amber-700 ring-amber-200',
  sakit: 'bg-sky-100 text-sky-700 ring-sky-200',
  alpa: 'bg-rose-100 text-rose-700 ring-rose-200',
  default: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const STATUS_LABELS = {
  hadir: 'Hadir',
  izin: 'Izin',
  sakit: 'Sakit',
  alpa: 'Alpa',
  default: 'Belum',
}

export default function StatusPill({ status = 'default', className = '' }) {
  const normalized = STATUS_STYLES[status] ? status : 'default'

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[normalized]} ${className}`}
    >
      {STATUS_LABELS[normalized]}
    </span>
  )
}
