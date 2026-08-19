import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { getClasses, getParents, getStudents, getTeachers } from '../api'

const resources = {
  teachers: { title: 'Data Guru', loader: getTeachers, columns: [['nama_guru', 'Nama'], ['nip', 'NIP']] },
  students: { title: 'Data Siswa', loader: getStudents, columns: [['nama_siswa', 'Nama'], ['nis', 'NIS'], ['kelas_id', 'Kelas ID'], ['orang_tua_id', 'Wali ID']] },
  parents: { title: 'Data Wali', loader: getParents, columns: [['nama_ortu', 'Nama'], ['email', 'Email'], ['user_id', 'User ID']] },
  classes: { title: 'Data Kelas', loader: getClasses, columns: [['nama_kelas', 'Nama kelas'], ['id', 'ID']] },
}

export default function AdminResourcePage({ resource }) {
  const config = resources[resource]
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  useEffect(() => { config.loader().then(setRows).catch(() => setRows([])) }, [config])
  const filteredRows = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()))

  return <div className="space-y-6 p-4 md:p-6 lg:p-8">
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Admin</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">{config.title}</h2></div><div className="flex gap-3"><label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari data" className="w-32 bg-transparent text-sm outline-none" /></label><button type="button" title="Tambah data" className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Tambah</button></div></div></section>
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full text-left"><thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500"><tr>{config.columns.map(([, label]) => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}<th className="px-4 py-3 font-medium">Aksi</th></tr></thead><tbody>{filteredRows.map((row) => <tr key={row.id} className="border-t border-slate-200"><>{config.columns.map(([key]) => <td key={key} className="px-4 py-4 text-sm text-slate-600">{row[key] ?? '-'}</td>)}</><td className="px-4 py-4 text-xs text-slate-400">CRUD belum tersedia di API</td></tr>)}{filteredRows.length === 0 && <tr><td colSpan={config.columns.length + 1} className="px-4 py-12 text-center text-sm text-slate-500">Tidak ada data dari server.</td></tr>}</tbody></table></div></section>
  </div>
}