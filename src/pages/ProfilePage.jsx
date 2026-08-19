import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getTeachers, getUsers } from '../api'

export default function ProfilePage() {
  const sessionTeacher = JSON.parse(localStorage.getItem('absensi_teacher') || 'null')
  const teacherUserId = sessionTeacher?.userId
  const [teacher, setTeacher] = useState(sessionTeacher)
  const [username, setUsername] = useState('-')

  useEffect(() => {
    Promise.all([getTeachers(), getUsers()]).then(([teachers, users]) => {
      const user = users.find((item) => item.id === teacherUserId)
      const teacherData = teachers.find((item) => item.user_id === teacherUserId)
      setTeacher(teacherData ? { ...teacherData, name: teacherData.nama_guru, nip: teacherData.nip } : sessionTeacher)
      setUsername(user?.username || '-')
    }).catch(() => {})
  }, [sessionTeacher, teacherUserId])

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-100 to-sky-200 text-2xl font-semibold text-blue-700">{(teacher?.name || 'G').charAt(0)}</div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Profil guru</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">{teacher?.name || 'Guru'}</h2>
              <p className="mt-1 text-sm text-slate-500">NIP {teacher?.nip || '-'}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            Akun aktif
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Data akun</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <Mail className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Username</p>
                <p className="text-sm font-medium text-slate-700">{username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <Phone className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">NIP</p>
                <p className="text-sm font-medium text-slate-700">{teacher?.nip || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <MapPin className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">User ID</p>
                <p className="text-sm font-medium text-slate-700">{teacher?.user_id || sessionTeacher?.userId || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Keterangan</p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Email, telepon, alamat, dan metrik performa belum tersedia dari endpoint backend.</div>
        </div>
      </section>
    </div>
  )
}
