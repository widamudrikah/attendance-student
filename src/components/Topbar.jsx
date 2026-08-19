import { Bell, CalendarDays, ChevronDown, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, subtitle, onMenuToggle, userName = 'Siti Nurhaliza', role = 'Guru' }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('absensi_student')
    localStorage.removeItem('absensi_teacher')
    localStorage.removeItem('absensi_parent')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#f5f7fb]/80 px-4 py-4 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
            aria-label="Buka navigasi"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{subtitle}</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-slate-900 md:text-2xl">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm md:flex">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-200 text-sm font-semibold text-blue-700">
                {userName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  )
}
