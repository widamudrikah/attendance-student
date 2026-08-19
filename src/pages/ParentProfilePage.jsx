import { Mail, ShieldCheck, UserRound } from 'lucide-react'

export default function ParentProfilePage() {
  const parent = JSON.parse(localStorage.getItem('absensi_parent') || 'null')

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-100 to-teal-200 text-2xl font-semibold text-emerald-700">
              {(parent?.name || 'W').charAt(0)}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Profil wali</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">{parent?.name || 'Wali'}</h2>
              <p className="mt-1 text-sm text-slate-500">Username: {parent?.username || '-'}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-600">
            <ShieldCheck className="h-4 w-4" /> Akun aktif
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Data akun</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <UserRound className="h-4 w-4 text-slate-500" />
              <div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Username</p><p className="text-sm font-medium text-slate-700">{parent?.username || '-'}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <Mail className="h-4 w-4 text-slate-500" />
              <div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Email</p><p className="text-sm font-medium text-slate-700">{parent?.email || '-'}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              <div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">ID wali</p><p className="text-sm font-medium text-slate-700">{parent?.id || '-'}</p></div>
            </div>
          </div>
        </div>
        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Keterangan</p>
          <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Nomor telepon, alamat, dan foto profil belum tersedia dari backend.</p>
        </div>
      </section>
    </div>
  )
}
