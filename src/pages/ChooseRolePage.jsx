import { ArrowRight, BriefcaseBusiness, ShieldCheck, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const roles = [
  {
    id: 'teacher',
    label: 'Guru',
    description: 'Kelola absensi, kelas, dan rekap kehadiran siswa.',
    icon: BriefcaseBusiness,
    accent: 'from-slate-900 via-slate-800 to-slate-700',
    route: '/teacher-login',
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Kelola guru, siswa, wali, dan dashboard sekolah.',
    icon: ShieldCheck,
    accent: 'from-blue-600 via-indigo-600 to-slate-800',
    route: '/admin-login',
  },
  {
    id: 'parent',
    label: 'Orang Tua',
    description: 'Pantau status kehadiran anak secara real-time.',
    icon: Users,
    accent: 'from-emerald-500 via-teal-500 to-cyan-600',
    route: '/parent-login',
  },
]

export default function ChooseRolePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.8),_rgba(255,255,255,1)_35%,_#f5f7fb_100%)] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Smart School</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.08em] text-slate-900 md:text-5xl">
            Pilih role akun
          </h1>
          <p className="mt-3 text-sm text-slate-500 md:text-base">
            Login sesuai peran Anda untuk mengakses fitur absensi sekolah.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {roles.map(({ id, label, description, icon: Icon, accent, route }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(route)}
              className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white text-left shadow-[0_18px_44px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_52px_rgba(15,23,42,0.08)]"
            >
              <div className={`h-28 bg-gradient-to-br ${accent} p-5`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-semibold tracking-[-0.05em] text-slate-900">{label}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  Masuk sebagai {label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
