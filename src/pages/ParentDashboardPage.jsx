import { useEffect, useState } from 'react'
import { CalendarCheck2, UserRound } from 'lucide-react'
import { dateKey, formatDate, formatTime, getClasses, getStudentAttendances, getStudents } from '../api'

export default function ParentDashboardPage() {
  const parent = JSON.parse(localStorage.getItem('absensi_parent') || 'null')
  const [student, setStudent] = useState(null)
  const [attendance, setAttendance] = useState([])

  useEffect(() => {
    Promise.all([getStudents(), getClasses(), getStudentAttendances()]).then(([students, classes, attendances]) => {
      const child = students.find((item) => item.orang_tua_id === parent?.id)
      setStudent(child ? { ...child, className: classes.find((item) => item.id === child.kelas_id)?.nama_kelas || '-' } : null)
      setAttendance(child ? attendances.filter((item) => item.siswa_id === child.id) : [])
    }).catch(() => {})
  }, [parent?.id])

  const today = new Date().toISOString().slice(0, 10)
  const todayAttendance = attendance.filter((item) => dateKey(item.tanggal) === today).sort((a, b) => b.id - a.id)[0]
  const presentDays = attendance.filter((item) => item.status === 'hadir').length
  const statusItems = attendance.slice(-5).reverse()

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-5 text-white shadow-[0_22px_36px_rgba(16,185,129,0.22)] md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-100">Monitoring</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.07em] md:text-4xl">{student?.nama_siswa || 'Memuat data anak...'}</h2>
            <p className="mt-2 text-sm text-emerald-100/80">Kelas {student?.className || '-'} · NIS {student?.nis || '-'}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <CalendarCheck2 className="h-4 w-4 text-white" />
              <span>{formatDate(today)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Kehadiran</p>
          <h3 className="mt-4 text-3xl font-bold tracking-[-0.06em] text-slate-900">{presentDays}</h3>
          <p className="mt-4 text-sm font-medium text-slate-500">Record dengan status hadir</p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Total absensi</p>
          <h3 className="mt-4 text-3xl font-bold tracking-[-0.06em] text-slate-900">{attendance.length}</h3>
          <p className="mt-4 text-sm font-medium text-slate-500">Total data absensi</p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Status hari ini</p>
          <h3 className="mt-4 text-3xl font-bold tracking-[-0.06em] text-slate-900">{todayAttendance?.status || 'Belum'}</h3>
          <p className="mt-4 text-sm font-medium text-slate-500">Datang {formatTime(todayAttendance?.jam_datang)}</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Ringkasan absensi</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-slate-900">Data absensi anak</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">{attendance.length} record</span>
        </div>

        <div className="mt-6 space-y-3">
          {statusItems.length > 0 ? statusItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-[22px] bg-slate-50 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(item.tanggal)}</p>
                  <p className="text-xs text-slate-500">Datang {formatTime(item.jam_datang)} · Pulang {formatTime(item.jam_pulang)}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ring-1 ${
                  item.status === 'hadir'
                    ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
                    : item.status === 'izin'
                      ? 'bg-amber-100 text-amber-700 ring-amber-200'
                      : item.status === 'sakit'
                        ? 'bg-sky-100 text-sky-700 ring-sky-200'
                        : 'bg-rose-100 text-rose-700 ring-rose-200'
                }`}
              >
                {item.status}
              </span>
            </div>
          )) : <p className="text-sm text-slate-500">Belum ada data absensi anak.</p>}
        </div>
      </section>
    </div>
  )
}
