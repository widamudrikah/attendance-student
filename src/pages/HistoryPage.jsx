import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Funnel, Search } from 'lucide-react'
import StatusPill from '../components/StatusPill'
import { dateKey, formatDate, formatTime, getClasses, getStudentAttendances, getStudents } from '../api'

export default function HistoryPage() {
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [classes, setClasses] = useState([])
  const [records, setRecords] = useState([])

  useEffect(() => {
    Promise.all([getStudentAttendances(), getStudents(), getClasses()]).then(([attendances, students, classList]) => {
      setClasses(classList)
      setRecords(attendances.map((record) => {
        const student = students.find((item) => item.id === record.siswa_id)
        const classItem = classList.find((item) => item.id === student?.kelas_id)
        return { ...record, studentName: student?.nama_siswa || '-', className: classItem?.nama_kelas || '-' }
      }))
    }).catch(() => {})
  }, [])

  const filteredHistory = useMemo(
    () =>
      records.filter((record) =>
        (selectedClass === 'all' || record.className === selectedClass) &&
        (!selectedDate || dateKey(record.tanggal) === selectedDate),
      ),
    [records, selectedClass, selectedDate],
  )

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Riwayat absensi</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">Data kehadiran terkini</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none"
              />
            </label>

            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <Funnel className="h-4 w-4 text-slate-400" />
              <select
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="all">Semua kelas</option>
                {classes.map((item) => <option key={item.id} value={item.nama_kelas}>{item.nama_kelas}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Siswa</th>
                <th className="px-4 py-3 font-medium">Kelas</th>
                <th className="px-4 py-3 font-medium">Jam</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record) => (
                  <tr key={record.id} className="border-t border-slate-200 transition hover:bg-slate-50/80">
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatDate(record.tanggal)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-800">{record.studentName}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{record.className}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">Datang {formatTime(record.jam_datang)} · Pulang {formatTime(record.jam_pulang)}</td>
                    <td className="px-4 py-4">
                      <StatusPill status={record.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-5 w-5 text-slate-400" />
                      Tidak ada data untuk filter yang dipilih.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
