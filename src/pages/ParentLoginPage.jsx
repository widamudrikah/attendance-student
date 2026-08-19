import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, HeartHandshake, LockKeyhole, UserRound } from 'lucide-react'
import { getParents, getUsers } from '../api'

export default function ParentLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('ortu_budi')
  const [password, setPassword] = useState('ortu123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const [users, parents] = await Promise.all([getUsers(), getParents()])
      const user = users.find((item) => item.username === username.trim() && item.role === 'ortu' && item.password === password)
      if (!user) throw new Error('Username atau password wali tidak sesuai.')
      const parent = parents.find((item) => item.user_id === user.id)
      if (!parent) throw new Error('Profil wali tidak ditemukan di server.')

      localStorage.setItem('absensi_parent', JSON.stringify({
        id: parent.id,
        name: parent.nama_ortu,
        email: parent.email,
        userId: user.id,
        username: user.username,
      }))
      navigate('/parent/dashboard')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(209,250,229,0.8),_rgba(255,255,255,1)_35%,_#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-700 p-8 text-white md:p-10">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10 ring-1 ring-white/10"><HeartHandshake className="h-7 w-7" /></div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Orang Tua</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.07em]">Pantau anak Anda</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-100/90">Lihat status kehadiran anak secara mudah dan aman setiap hari di sekolah.</p>
            </div>
            <div className="mt-10 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Status terkini</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">Data orang tua</p>
              <p className="mt-1 text-sm text-emerald-50/80">Nama dan status anak mengikuti data API.</p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-emerald-50 text-emerald-600"><UserRound className="h-7 w-7" /></div>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-slate-900">Masuk sebagai orang tua</h2>
                <p className="mt-2 text-sm text-slate-500">Gunakan username dan password wali</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Username wali</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                    <UserRound className="h-4 w-4 text-slate-400" />
                    <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Masukkan username" />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                  </div>
                </label>

                {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(15,23,42,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800">
                  {loading ? 'Memeriksa...' : 'Masuk'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <button type="button" onClick={() => navigate('/')} className="mt-5 block w-full text-center text-sm font-medium text-emerald-600 transition hover:text-emerald-500">Kembali ke pilih role</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
