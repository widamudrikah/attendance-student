import { ArrowRight, BriefcaseBusiness, GraduationCap, HeartHandshake, ScanLine, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const features = [
  { title: 'Absensi Real-time', text: 'Pantau kehadiran siswa secara cepat dan akurat setiap hari.', icon: ShieldCheck },
  { title: 'Monitoring Orang Tua', text: 'Orang tua dapat melihat status kehadiran anaknya dengan jelas.', icon: HeartHandshake },
  { title: 'Dashboard Lengkap', text: 'Guru mendapatkan ringkasan kehadiran dan statistik harian.', icon: BriefcaseBusiness },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.85),_rgba(255,255,255,1)_25%,_#f7fafc_60%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-slate-200 bg-white/70 px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.15)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Smart School</p>
              <p className="text-sm font-semibold text-slate-900">Absensi Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/choose-role')}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Pilih Role
            </button>
          </div>
        </header>

        <main className="pb-12 pt-10 md:pt-14">
          <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Sistem sekolah modern
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.08em] text-slate-900 md:text-6xl">
                Absensi siswa lebih cepat, lebih rapi, dan lebih transparan.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                Platform absensi sekolah untuk admin, guru, dan wali dengan pencatatan kehadiran melalui barcode NIS siswa.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/teacher-login')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_28px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Login guru
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/scan')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ScanLine className="h-4 w-4" />
                  Scan barcode siswa
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/parent-login')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  Login wali
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_30px_70px_rgba(15,23,42,0.08)] md:p-6">
              <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Hari ini</p>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-100">
                    Online
                  </span>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Data rekap absensi</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">Belum tersedia dari endpoint backend yang diberikan.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 grid gap-4 md:grid-cols-3">
            {features.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_30px_rgba(15,23,42,0.04)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.05em] text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
