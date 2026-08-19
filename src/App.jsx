import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BookOpenCheck, Clock3, Settings2, UserCircle2, Users } from 'lucide-react'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import ChooseRolePage from './pages/ChooseRolePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminResourcePage from './pages/AdminResourcePage'
import BarcodeAttendancePage from './pages/BarcodeAttendancePage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ParentDashboardPage from './pages/ParentDashboardPage'
import ParentHistoryPage from './pages/ParentHistoryPage'
import ParentLoginPage from './pages/ParentLoginPage'
import ParentProfilePage from './pages/ParentProfilePage'
import ParentReportPage from './pages/ParentReportPage'
import ProfilePage from './pages/ProfilePage'
import StudentsPage from './pages/StudentsPage'

const teacherRoutes = [
  { path: '/teacher/dashboard', title: 'Dashboard', subtitle: 'Ringkasan' },
  { path: '/teacher/students', title: 'Daftar Siswa', subtitle: 'Kelas' },
  { path: '/teacher/history', title: 'Riwayat Absensi', subtitle: 'Rekap' },
  { path: '/teacher/profile', title: 'Profil Guru', subtitle: 'Akun' },
]

const parentNavItems = [
  { label: 'Beranda', to: '/parent/dashboard', icon: BookOpenCheck },
  { label: 'Laporan', to: '/parent/report', icon: Clock3 },
  { label: 'Riwayat', to: '/parent/history', icon: Clock3 },
  { label: 'Profil', to: '/parent/profile', icon: UserCircle2 },
]

const adminNavItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: Settings2 },
  { label: 'Guru', to: '/admin/teachers', icon: UserCircle2 },
  { label: 'Siswa', to: '/admin/students', icon: Users },
  { label: 'Wali', to: '/admin/parents', icon: Users },
]

function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = location.pathname.includes('teachers') ? 'Data Guru' : location.pathname.includes('students') ? 'Data Siswa' : location.pathname.includes('parents') ? 'Data Wali' : 'Dashboard'

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} navItems={adminNavItems} role="Admin" />
        <main className="flex-1">
          <Topbar title={title} subtitle="Administrasi" onMenuToggle={() => setSidebarOpen(true)} userName="Admin" role="Admin" />
          <div className="pb-24 lg:pb-8"><Routes><Route path="/dashboard" element={<AdminDashboardPage />} /><Route path="/teachers" element={<AdminResourcePage resource="teachers" />} /><Route path="/students" element={<AdminResourcePage resource="students" />} /><Route path="/parents" element={<AdminResourcePage resource="parents" />} /><Route path="*" element={<Navigate to="/admin/dashboard" replace />} /></Routes></div>
        </main>
      </div>
      <BottomNav navItems={adminNavItems} />
    </div>
  )
}

function TeacherShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const activeRoute =
    teacherRoutes.find((route) => location.pathname.startsWith(route.path)) || teacherRoutes[0]
  const teacher = JSON.parse(localStorage.getItem('absensi_teacher') || 'null')

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="Guru" />

        <main className="flex-1">
          <Topbar
            title={activeRoute.title}
            subtitle={activeRoute.subtitle}
            onMenuToggle={() => setSidebarOpen(true)}
            userName={teacher?.name || 'Guru'}
            role="Guru"
          />

          <div className="pb-24 lg:pb-8">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}

function ParentShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const parentPages = [
    { path: '/parent/dashboard', title: 'Dashboard', subtitle: 'Monitoring' },
    { path: '/parent/report', title: 'Laporan Absensi', subtitle: 'Analisis' },
    { path: '/parent/history', title: 'Riwayat Kehadiran', subtitle: 'Kehadiran' },
    { path: '/parent/profile', title: 'Profil Orang Tua', subtitle: 'Akun' },
  ]
  const activeRoute =
    parentPages.find((route) => location.pathname.startsWith(route.path)) || parentPages[0]
  const parent = JSON.parse(localStorage.getItem('absensi_parent') || 'null')

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} navItems={parentNavItems} role="Orang tua" />

        <main className="flex-1">
          <Topbar
            title={activeRoute.title}
            subtitle={activeRoute.subtitle}
            onMenuToggle={() => setSidebarOpen(true)}
            userName={parent?.name || 'Orang tua'}
            role="Orang tua"
          />

          <div className="pb-24 lg:pb-8">
            <Routes>
              <Route path="/dashboard" element={<ParentDashboardPage />} />
              <Route path="/report" element={<ParentReportPage />} />
              <Route path="/history" element={<ParentHistoryPage />} />
              <Route path="/profile" element={<ParentProfilePage />} />
              <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <BottomNav navItems={parentNavItems} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/choose-role" element={<ChooseRolePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/teacher-login" element={<LoginPage />} />
      <Route path="/scan" element={<BarcodeAttendancePage />} />
      <Route path="/parent-login" element={<ParentLoginPage />} />
      <Route path="/admin-login" element={<LoginPage role="admin" />} />
      <Route path="/teacher/*" element={<TeacherShell />} />
      <Route path="/admin/*" element={<AdminShell />} />
      <Route path="/parent/*" element={<ParentShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
