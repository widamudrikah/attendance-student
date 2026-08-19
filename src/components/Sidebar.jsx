import { NavLink } from 'react-router-dom'
import { BookOpenCheck, GraduationCap, History, LayoutDashboard, UserCircle2, X } from 'lucide-react'

const defaultNavItems = [
  { label: 'Dashboard', to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Daftar Siswa', to: '/teacher/students', icon: GraduationCap },
  { label: 'Riwayat', to: '/teacher/history', icon: History },
  { label: 'Profil', to: '/teacher/profile', icon: UserCircle2 },
]

export default function Sidebar({ isOpen, onClose, navItems = defaultNavItems, role = 'Guru' }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_10px_22px_rgba(37,99,235,0.35)]">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Sekolah</p>
              <h2 className="text-lg font-semibold tracking-[-0.04em] text-slate-900">Smart School</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
            aria-label="Tutup navigasi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_16px_28px_rgba(15,23,42,0.18)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-[26px] bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">Status</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{role} aktif</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
          </div>
        </div>
      </aside>
    </>
  )
}
