import { GraduationCap, History, LayoutDashboard, UserCircle2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const defaultNavItems = [
  { label: 'Beranda', to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Siswa', to: '/teacher/students', icon: GraduationCap },
  { label: 'Riwayat', to: '/teacher/history', icon: History },
  { label: 'Profil', to: '/teacher/profile', icon: UserCircle2 },
]

export default function BottomNav({ navItems = defaultNavItems }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-all ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
