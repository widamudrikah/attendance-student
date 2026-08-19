import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import StatusPill from '../components/StatusPill'
import { dateKey, getClasses, getStudentAttendances, getStudents, normalizeStudent, submitAttendance } from '../api'

export default function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState('X-A')
  const [studentList, setStudentList] = useState([])
  const [classes, setClasses] = useState([])
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [actionMessage, setActionMessage] = useState('')

  const markAttendance = async (student, status) => {
    setActionMessage('')
    setSavingId(student.id)
    try {
      // Semua status dikirim ke endpoint yang sama dengan status_kehadiran
      // hadir → tipe_absen: 'datang', tanpa status_kehadiran
      // izin/sakit/alpa → tipe_absen: 'datang', status_kehadiran: <status>
      const statusKehadiran = status !== 'hadir' ? status : null
      await submitAttendance(student.nis, 'datang', statusKehadiran)
      setStudentList((current) =>
        current.map((item) => item.id === student.id ? { ...item, status } : item)
      )
      setActionMessage(`Absensi ${status} untuk ${student.name} berhasil dicatat.`)
    } catch (error) {
      setActionMessage(error.message)
    } finally {
      setSavingId(null)
    }
  }

  useEffect(() => {
    Promise.all([getStudents(), getClasses(), getStudentAttendances()])
      .then(([students, classList, attendances]) => {
        setClasses(classList)
        const today = new Date().toISOString().slice(0, 10)
        setStudentList(students.map((student) => ({
          ...normalizeStudent(student, classList),
          status: attendances.find((item) => item.siswa_id === student.id && dateKey(item.tanggal) === today)?.status || 'default',
        })))
        if (classList[0]) setSelectedClass(classList[0].nama_kelas)
      })
      .catch(() => {})
  }, [])

  const filteredStudents = useMemo(
    () => studentList.filter((student) => student.className === selectedClass && student.name.toLowerCase().includes(query.toLowerCase())),
    [selectedClass, studentList, query],
  )

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Daftar siswa</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">Kelas {selectedClass}</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input
                type="text"
                placeholder="Cari siswa"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-28 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-36"
              />
            </label>

            <div className="relative">
              <select
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.nama_kelas}>{classItem.nama_kelas}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">No</th>
                <th className="px-4 py-3 font-medium">Siswa</th>
                <th className="px-4 py-3 font-medium">NIS</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Input absensi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="border-t border-slate-200 transition hover:bg-slate-50/80">
                  <td className="px-4 py-4 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-200 text-sm font-semibold text-blue-700">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">Kelas {student.className}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{student.nis}</td>
                  <td className="px-4 py-4">
                    <StatusPill status={student.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {['hadir', 'izin', 'sakit', 'alpa'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={savingId === student.id}
                          onClick={() => markAttendance(student, status)}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${student.status === status ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'} disabled:opacity-50`}
                        >
                          {student.status === status && <Check className="h-3 w-3" />}
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {actionMessage && (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700 ring-1 ring-amber-200">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{actionMessage}</p>
        </div>
      )}

      <p className="text-right text-xs text-slate-400">Data siswa bersumber dari backend.</p>
    </div>
  )
}
