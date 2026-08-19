import { useEffect, useState } from 'react'
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  GraduationCap,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react'
import { dateKey, formatDate, formatTime, getParents, getStudentAttendances, getStudents, getTeachers } from '../api'

const ATTENDANCE_COLORS = {
  hadir:  { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  izin:   { bg: 'bg-amber-400',   light: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-200'   },
  sakit:  { bg: 'bg-sky-400',     light: 'bg-sky-50',     text: 'text-sky-700',     ring: 'ring-sky-200'     },
  alpa:   { bg: 'bg-rose-500',    light: 'bg-rose-50',    text: 'text-rose-700',    ring: 'ring-rose-200'    },
}

export default function AdminDashboardPage() {
  const admin = JSON.parse(localStorage.getItem('absensi_admin') || 'null')
  const [counts, setCounts] = useState({ teachers: null, students: null, parents: null })
  const [todayAttendance, setTodayAttendance] = useState([])
  const [recentAttendance, setRecentAttendance] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    Promise.all([getTeachers(), getStudents(), getParents(), getStudentAttendances()])
      .then(([teachers, studentList, parents, attendance]) => {
        setCounts({ teachers: teachers.length, students: studentList.length, parents: parents.length })
        setStudents(studentList)
        const todayRecs = attendance.filter((item) => dateKey(item.tanggal) === today)
        setTodayAttendance(todayRecs)
        setRecentAttendance([...attendance].sort((a, b) => b.id - a.id).slice(0, 6))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const today = new Date()
  const statusKeys = ['hadir', 'izin', 'sakit', 'alpa']
  const statusCounts = Object.fromEntries(
    statusKeys.map((s) => [s, todayAttendance.filter((item) => item.status === s).length])
  )
  const totalToday = todayAttendance.length || 1 // prevent division by zero

  const statCards = [
    { label: 'Total Guru', value: counts.teachers, icon: UserRound, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-purple-200' },
    { label: 'Total Siswa', value: counts.students, icon: GraduationCap, gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-200' },
    { label: 'Total Wali', value: counts.parents, icon: Users, gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-200' },
    { label: 'Absensi Hari Ini', value: todayAttendance.length, icon: CalendarCheck2, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200' },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-[0_24px_48px_rgba(15,23,42,0.18)] md:p-8">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-indigo-500/10" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm">
              <Activity className="h-3 w-3 text-emerald-400" />
              Live Dashboard
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
              Selamat datang, {admin?.name || 'Admin'}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
            <BookOpenCheck className="h-5 w-5 text-sky-300" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Absensi hari ini</p>
              <p className="text-xl font-bold text-white">{todayAttendance.length} record</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, gradient, shadow }) => (
          <div key={label} className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${gradient} p-5 text-white shadow-xl ${shadow}`}>
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">{label}</p>
                <p className="mt-3 text-4xl font-bold tracking-[-0.06em]">
                  {value === null ? (loading ? '…' : '-') : value}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-white/70">
              <TrendingUp className="h-3.5 w-3.5" />
              Data live dari API
            </div>
          </div>
        ))}
      </section>

      {/* Attendance Chart + Recent */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Absensi Chart */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Statistik</p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.05em] text-slate-900">Absensi hari ini</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
              {todayAttendance.length} total
            </span>
          </div>

          {/* Bar Chart */}
          <div className="mt-6 space-y-3">
            {statusKeys.map((status) => {
              const count = statusCounts[status]
              const pct = Math.round((count / totalToday) * 100)
              const color = ATTENDANCE_COLORS[status]
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium capitalize text-slate-700">{status}</span>
                    <span className="font-semibold text-slate-900">{count} <span className="font-normal text-slate-400">({pct}%)</span></span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${color.bg} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {statusKeys.map((status) => {
              const color = ATTENDANCE_COLORS[status]
              return (
                <span key={status} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ring-1 ${color.light} ${color.text} ${color.ring}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${color.bg}`} />
                  {status}
                </span>
              )
            })}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Aktivitas</p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.05em] text-slate-900">Absensi terbaru</h3>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-300" />
          </div>

          <div className="mt-5 space-y-3">
            {recentAttendance.length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada data absensi.</p>
            ) : recentAttendance.map((item) => {
              const studentData = students.find((s) => s.id === item.siswa_id)
              const color = ATTENDANCE_COLORS[item.status] || ATTENDANCE_COLORS.alpa
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-3.5 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color.light} text-xs font-bold ${color.text}`}>
                      {(studentData?.nama_siswa || 'S').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900">{studentData?.nama_siswa || `Siswa #${item.siswa_id}`}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(item.tanggal)} · {formatTime(item.jam_datang)}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ring-1 ${color.light} ${color.text} ${color.ring}`}>
                    {item.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
