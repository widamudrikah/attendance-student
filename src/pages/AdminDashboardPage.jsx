import { useEffect, useState } from 'react'
import { BarChart3, GraduationCap, Users, UserRound } from 'lucide-react'
import { getParents, getStudentAttendances, getStudents, getTeachers } from '../api'

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ teachers: '-', students: '-', parents: '-', attendance: '-' })

  useEffect(() => {
    Promise.all([getTeachers(), getStudents(), getParents(), getStudentAttendances()])
      .then(([teachers, students, parents, attendance]) => setCounts({ teachers: teachers.length, students: students.length, parents: parents.length, attendance: attendance.length }))
      .catch(() => {})
  }, [])

  const cards = [['Guru', counts.teachers, UserRound], ['Siswa', counts.students, GraduationCap], ['Wali', counts.parents, Users], ['Absensi', counts.attendance, BarChart3]]

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Admin</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.07em]">Dashboard sekolah</h2>
        <p className="mt-2 text-sm text-slate-300">Ringkasan data yang tersedia dari backend.</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Total {label}</p><h3 className="mt-4 text-3xl font-bold text-slate-900">{value}</h3></div><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></div></div>
            <p className="mt-4 text-sm text-slate-500">Data live dari API</p>
          </div>
        ))}
      </section>
    </div>
  )
}
