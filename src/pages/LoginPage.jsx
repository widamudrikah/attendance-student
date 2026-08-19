import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, LockKeyhole, Mail } from 'lucide-react'
import { getTeachers, getUsers } from '../api'

export default function LoginPage({ role = 'guru' }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState(role === 'admin' ? 'admin_sekolah' : 'tia_guru')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const users = await getUsers()
      const user = users.find((item) => item.username === username.trim() && item.role === role)
      if (!user) throw new Error(`Username ${role} tidak ditemukan di server.`)
      if (role === 'admin') {
        localStorage.setItem('absensi_admin', JSON.stringify({ name: user.username, userId: user.id }))
        navigate('/admin/dashboard')
      } else {
        const teachers = await getTeachers()
        const teacher = teachers.find((item) => item.user_id === user.id)
        localStorage.setItem('absensi_teacher', JSON.stringify({ name: teacher?.nama_guru || user.username, nip: teacher?.nip || '-', userId: user.id }))
        navigate('/teacher/dashboard')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.65),_rgba(255,255,255,0.96)_30%,_#f8fafc_70%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:grid-cols-2">
          <div className="flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white md:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10 ring-1 ring-white/10 backdrop-blur-sm">
              <BookOpenCheck className="h-7 w-7" />
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">Smart School</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.08em] text-white">Absensi Digital</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Kelola kehadiran siswa dengan cepat, aman, dan konsisten dalam satu tampilan yang sederhana.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                <span className="text-lg font-semibold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Kehadiran hari ini</p>
                <p className="text-xs text-slate-300">Rekap absensi akan tampil setelah endpoint tersedia.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-blue-50 text-blue-600 shadow-[0_18px_32px_rgba(59,130,246,0.12)]">
                  <BookOpenCheck className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-slate-900">Masuk ke akun</h2>
                <p className="mt-2 text-sm text-slate-500">Selamat datang, silakan masuk sebagai {role}</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Username {role}</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder="Masukkan username"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      defaultValue="password123"
                      className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder="Masukkan password"
                    />
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-500">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    Ingat saya
                  </label>
                  <button type="button" className="font-medium text-blue-600 transition hover:text-blue-500">
                    Lupa password?
                  </button>
                </div>

                {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(15,23,42,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  {loading ? 'Memeriksa...' : 'Masuk'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
