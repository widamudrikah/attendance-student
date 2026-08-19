import { useEffect, useState } from 'react'
import {
  Activity,
  BadgeAlert,
  BadgeCheck,
  BriefcaseMedical,
  CalendarCheck2,
  Clock3,
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { dateKey, getClasses, getStudentAttendances, getStudents } from '../api'

const statIcons = {
  blue: CalendarCheck2,
  amber: BadgeAlert,
  sky: BriefcaseMedical,
  rose: Activity,
}

export default function DashboardPage() {
  const teacher = JSON.parse(localStorage.getItem('absensi_teacher') || 'null')
  const [studentCount, setStudentCount] = useState(null)
  const [classCount, setClassCount] = useState(null)
  const [todayAttendance, setTodayAttendance] = useState([])

  useEffect(() => {
    Promise.all([getStudents(), getClasses(), getStudentAttendances()]).then(([students, classes, attendance]) => {
      setStudentCount(students.length)
      setClassCount(classes.length)
      setTodayAttendance(attendance.filter((item) => dateKey(item.tanggal) === new Date().toISOString().slice(0, 10)))
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total siswa', value: studentCount ?? '-', tone: 'blue', meta: 'Dari endpoint siswa' },
    { label: 'Total kelas', value: classCount ?? '-', tone: 'sky', meta: 'Dari endpoint kelas' },
    { label: 'Absensi hari ini', value: todayAttendance.length, tone: 'amber', meta: 'Record dari database' },
    { label: 'Hadir hari ini', value: todayAttendance.filter((item) => item.status === 'hadir').length, tone: 'rose', meta: 'Status hadir dari database' },
  ].map((item) => ({ ...item, icon: statIcons[item.tone] || CalendarCheck2 }))

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-[0_22px_36px_rgba(15,23,42,0.12)] md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-300">Ringkasan hari ini</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.07em] md:text-4xl">Selamat pagi, {teacher?.name || 'Guru'}</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Clock3 className="h-4 w-4 text-sky-300" />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Kelas aktif</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">{classCount ?? '-'} Kelas</p>
          </div>
          <div className="rounded-[24px] bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Absensi hari ini</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">{todayAttendance.length}</p>
          </div>
          <div className="rounded-[24px] bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Belum hadir</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">{studentCount === null ? '-' : Math.max(studentCount - todayAttendance.length, 0)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatsCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
            meta={card.meta}
            tone={card.tone}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Performa</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-slate-900">Status absensi hari ini</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">Belum tersedia</span>
          </div>

          <div className="mt-6 flex h-40 items-center justify-center rounded-2xl bg-slate-50 text-center text-xs leading-5 text-slate-500">
            Hadir: {todayAttendance.filter((item) => item.status === 'hadir').length} · Izin: {todayAttendance.filter((item) => item.status === 'izin').length} · Sakit: {todayAttendance.filter((item) => item.status === 'sakit').length} · Alpa: {todayAttendance.filter((item) => item.status === 'alpa').length}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Catatan</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3 rounded-[22px] bg-emerald-50 p-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Terlaksana</p>
                  <p className="mt-1 text-xs text-slate-500">{todayAttendance.length} record absensi tercatat hari ini.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-[22px] bg-amber-50 p-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <BadgeAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Perhatian</p>
                  <p className="mt-1 text-xs text-slate-500">Status alpa hari ini: {todayAttendance.filter((item) => item.status === 'alpa').length}.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
