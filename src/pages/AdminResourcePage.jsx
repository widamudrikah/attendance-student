import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Check, Edit2, Loader2, Plus, Search, Trash2, X } from 'lucide-react'
import {
  createParent, createStudent, createTeacher,
  deleteParent, deleteStudent, deleteTeacher,
  getClasses, getParents, getStudents, getTeachers,
  updateParent, updateStudent, updateTeacher,
} from '../api'

// ─── Resource Config ───────────────────────────────────────────────────────────

function buildConfig(classes, parents) {
  return {
    teachers: {
      title: 'Data Guru',
      loader: getTeachers,
      columns: [
        { key: 'nama_guru', label: 'Nama Guru' },
        { key: 'nip', label: 'NIP' },
      ],
      display: (row) => ({ primary: row.nama_guru, secondary: `NIP: ${row.nip || '-'}` }),
      fields: [
        { key: 'nama_guru', label: 'Nama Guru', type: 'text', placeholder: 'Bu Tia', required: true },
        { key: 'nip', label: 'NIP', type: 'text', placeholder: '19900101', required: true },
      ],
      create: createTeacher,
      update: updateTeacher,
      remove: deleteTeacher,
      backendNote: 'Fitur tambah, edit, dan hapus guru belum didukung oleh backend saat ini.',
    },
    students: {
      title: 'Data Siswa',
      loader: getStudents,
      columns: [
        { key: 'nama_siswa', label: 'Nama Siswa' },
        { key: 'nis', label: 'NIS' },
        { key: 'kelas_id', label: 'Kelas', render: (val) => classes.find((c) => c.id === val)?.nama_kelas || `Kelas ${val}` },
        { key: 'orang_tua_id', label: 'Wali', render: (val) => parents.find((p) => p.id === val)?.nama_ortu || `Wali #${val}` },
      ],
      display: (row) => ({
        primary: row.nama_siswa,
        secondary: `NIS: ${row.nis} · ${classes.find((c) => c.id === row.kelas_id)?.nama_kelas || `Kelas ${row.kelas_id}`}`,
      }),
      fields: [
        { key: 'nama_siswa', label: 'Nama Siswa', type: 'text', placeholder: 'Budi Santoso', required: true },
        { key: 'nis', label: 'NIS', type: 'text', placeholder: '2026010', required: true },
        {
          key: 'kelas_id', label: 'Kelas', type: 'select', required: true,
          options: classes.map((c) => ({ value: c.id, label: c.nama_kelas })),
        },
        {
          key: 'orang_tua_id', label: 'Wali Murid', type: 'select', required: true,
          options: parents.map((p) => ({ value: p.id, label: p.nama_ortu })),
        },
      ],
      create: createStudent,
      update: updateStudent,
      remove: deleteStudent,
      backendNote: null, // create works; edit/delete will show error from backend
    },
    parents: {
      title: 'Data Wali Murid',
      loader: getParents,
      columns: [
        { key: 'nama_ortu', label: 'Nama Wali' },
        { key: 'email', label: 'Email' },
      ],
      display: (row) => ({ primary: row.nama_ortu, secondary: row.email || '-' }),
      fields: [
        { key: 'nama_ortu', label: 'Nama Wali', type: 'text', placeholder: 'Bapak Budi', required: true },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'ortu@email.com', required: true },
      ],
      create: createParent,
      update: updateParent,
      remove: deleteParent,
      backendNote: 'Fitur tambah, edit, dan hapus wali murid belum didukung oleh backend saat ini.',
    },
  }
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, children, onClose }) {
  const overlayRef = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-lg animate-[slideUp_0.2s_ease-out] rounded-[28px] border border-slate-200 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold tracking-[-0.04em] text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Form ──────────────────────────────────────────────────────────────────────

function ResourceForm({ fields, initial = {}, onSubmit, submitLabel, loading, error }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.key, initial[f.key] ?? ''])))
  const set = (key, val) => setValues((prev) => ({ ...prev, [key]: val }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(values) }} className="space-y-4">
      {fields.map((field) => (
        <label key={field.key} className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {field.label}{field.required && <span className="ml-0.5 text-rose-500">*</span>}
          </span>
          {field.type === 'select' ? (
            <select
              value={values[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
              required={field.required}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">-- Pilih --</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={values[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          )}
        </label>
      ))}

      {error && (
        <div className="flex items-start gap-2 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {loading ? 'Menyimpan...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminResourcePage({ resource }) {
  const [rows, setRows] = useState([])
  const [classes, setClasses] = useState([])
  const [parents, setParents] = useState([])
  const [query, setQuery] = useState('')
  const [pageLoading, setPageLoading] = useState(true)

  // Modal state: null | { mode: 'create' | 'edit' | 'delete', row?: object }
  const [modal, setModal] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null) // { type: 'success'|'error', text }

  const config = useMemo(() => buildConfig(classes, parents)[resource], [resource, classes, parents])

  const showToast = (type, text) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 4000)
  }

  const reload = () => {
    setPageLoading(true)
    config.loader().then(setRows).catch(() => setRows([])).finally(() => setPageLoading(false))
  }

  useEffect(() => {
    setPageLoading(true)
    setQuery('')
    setModal(null)
    Promise.all([
      buildConfig([], [])[resource].loader(),
      getClasses(),
      getParents(),
    ]).then(([data, cls, prts]) => {
      setRows(data)
      setClasses(cls)
      setParents(prts)
    }).catch(() => {}).finally(() => setPageLoading(false))
  }, [resource])

  const filtered = useMemo(() =>
    rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())),
    [rows, query]
  )

  const handleCreate = async (values) => {
    setFormLoading(true)
    setFormError('')
    try {
      await config.create(values)
      showToast('success', 'Data berhasil ditambahkan.')
      setModal(null)
      reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (values) => {
    setFormLoading(true)
    setFormError('')
    try {
      await config.update(modal.row.id, values)
      showToast('success', 'Data berhasil diperbarui.')
      setModal(null)
      reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    setFormError('')
    try {
      await config.remove(modal.row.id)
      showToast('success', 'Data berhasil dihapus.')
      setModal(null)
      reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const openCreate = () => {
    setFormError('')
    if (config.backendNote) {
      showToast('error', config.backendNote)
      return
    }
    setModal({ mode: 'create' })
  }

  const openEdit = (row) => {
    setFormError('')
    setModal({ mode: 'edit', row })
  }

  const openDelete = (row) => {
    setFormError('')
    setModal({ mode: 'delete', row })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-xl transition ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          {toast.type === 'success' ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Administrasi</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-slate-900">{config.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{rows.length} data terdaftar</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari data..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-40 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              Tambah {config.title.replace('Data ', '')}
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">No</th>
                {config.columns.map((col) => (
                  <th key={col.key} className="px-5 py-3 font-medium">{col.label}</th>
                ))}
                <th className="px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td colSpan={config.columns.length + 2} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded-full bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length + 2} className="px-5 py-16 text-center text-sm text-slate-400">
                    {query ? `Tidak ada hasil untuk "${query}"` : 'Belum ada data dari server.'}
                  </td>
                </tr>
              ) : filtered.map((row, index) => {
                const { primary, secondary } = config.display(row)
                return (
                  <tr key={row.id} className="group border-t border-slate-100 transition hover:bg-slate-50/70">
                    <td className="px-5 py-4 text-sm text-slate-400">{index + 1}</td>
                    {config.columns.map((col, ci) => (
                      <td key={col.key} className="px-5 py-4">
                        {ci === 0 ? (
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-bold text-slate-600">
                              {String(primary).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{primary}</p>
                              <p className="text-xs text-slate-400">{secondary}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-600">
                            {col.render ? col.render(row[col.key]) : (row[col.key] ?? '-')}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(row)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      {modal?.mode === 'create' && (
        <Modal title={`Tambah ${config.title.replace('Data ', '')}`} onClose={() => setModal(null)}>
          <ResourceForm
            fields={config.fields}
            onSubmit={handleCreate}
            submitLabel="Simpan Data"
            loading={formLoading}
            error={formError}
          />
        </Modal>
      )}

      {modal?.mode === 'edit' && (
        <Modal title={`Edit ${config.title.replace('Data ', '')}`} onClose={() => setModal(null)}>
          {config.backendNote ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700 ring-1 ring-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {config.backendNote}
              </div>
              <button type="button" onClick={() => setModal(null)} className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">Tutup</button>
            </div>
          ) : (
            <ResourceForm
              fields={config.fields}
              initial={modal.row}
              onSubmit={handleUpdate}
              submitLabel="Perbarui Data"
              loading={formLoading}
              error={formError}
            />
          )}
        </Modal>
      )}

      {modal?.mode === 'delete' && (
        <Modal title="Konfirmasi Hapus" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Hapus data ini?</p>
                <p className="mt-1 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">{config.display(modal.row).primary}</span> akan dihapus secara permanen.
                </p>
              </div>
            </div>

            {config.backendNote && (
              <div className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {config.backendNote}
              </div>
            )}

            {formError && (
              <div className="flex items-start gap-2 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setModal(null)} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={formLoading || !!config.backendNote}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {formLoading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}