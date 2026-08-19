import { useEffect, useState } from 'react'
import StatusPill from '../components/StatusPill'
import { dateKey, formatDate, formatTime, getStudentAttendances, getStudents } from '../api'

export default function ParentHistoryPage() {
  const parent = JSON.parse(localStorage.getItem('absensi_parent') || 'null')
  const [history, setHistory] = useState([])
  const [date, setDate] = useState('')
  useEffect(() => {
    Promise.all([getStudents(), getStudentAttendances()]).then(([students, attendances]) => {
      const child = students.find((item) => item.orang_tua_id === parent?.id)
      setHistory(child ? attendances.filter((item) => item.siswa_id === child.id) : [])
    }).catch(() => {})
  }, [parent?.id])
  const filteredHistory = history.filter((item) => !date || dateKey(item.tanggal) === date)
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Riwayat</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">Kehadiran anak</h2>
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="border-0 bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Waktu</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-t border-slate-200 transition hover:bg-slate-50/80">
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatDate(item.tanggal)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">Datang {formatTime(item.jam_datang)} · Pulang {formatTime(item.jam_pulang)}</td>
                  <td className="px-4 py-4">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">Data dari server</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
