import { useEffect, useState } from 'react'
import { BarChart3, CalendarDays, CheckCircle2, Clock3, HeartPulse, UserRound } from 'lucide-react'
import { getStudentAttendances, getStudents } from '../api'

const statuses = [
  { key: 'hadir', label: 'Hadir', tone: 'emerald', icon: CheckCircle2 },
  { key: 'izin', label: 'Izin', tone: 'amber', icon: Clock3 },
  { key: 'sakit', label: 'Sakit', tone: 'sky', icon: HeartPulse },
  { key: 'alpa', label: 'Alpa', tone: 'rose', icon: UserRound },
]

export default function ParentReportPage() {
  const parent = JSON.parse(localStorage.getItem('absensi_parent') || 'null')
  const [records, setRecords] = useState([])

  useEffect(() => {
    Promise.all([getStudents(), getStudentAttendances()]).then(([students, attendances]) => {
      const child = students.find((item) => item.orang_tua_id === parent?.id)
      setRecords(child ? attendances.filter((item) => item.siswa_id === child.id) : [])
    }).catch(() => {})
  }, [parent?.id])

  const counts = statuses.map((item) => ({ ...item, count: records.filter((record) => record.status === item.key).length }))
  const total = records.length

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Laporan</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">Rekap kehadiran anak</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">{total} data dari server</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map(({ key, label, tone, icon: Icon, count }) => (
          <div key={key} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <h3 className="mt-4 text-3xl font-bold tracking-[-0.06em] text-slate-900">{count}</h3>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : tone === 'amber' ? 'bg-amber-50 text-amber-600' : tone === 'sky' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Total status dari API</p>
          </div>
        ))}
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-slate-500" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Sumber laporan</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-slate-900">Absensi siswa</h3>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          Rekap dihitung di frontend dari field `status` pada endpoint `/api/absensi_siswa`.
        </div>
      </section>
    </div>
  )
}
