import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { Camera, CheckCircle2, Keyboard, Mail, ScanLine, XCircle } from 'lucide-react'
import { extractStudentIdentifier, findParentByStudent, getParents, getStudents, normalizeStudentIdentifier, resolveStudentIdentifier, submitAttendance } from '../api'
import { sendAttendanceNotification } from '../emailService'

export default function BarcodeAttendancePage() {
  const videoRef = useRef(null)
  const scannerControlsRef = useRef(null)
  const [nis, setNis] = useState('')
  const [type, setType] = useState('datang')
  const [students, setStudents] = useState([])
  const [parents, setParents] = useState([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [emailStatus, setEmailStatus] = useState(null) // null | 'sending' | 'sent' | 'failed'
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [rawScan, setRawScan] = useState('')
  const [resolvingScan, setResolvingScan] = useState(false)

  useEffect(() => {
    Promise.all([getStudents(), getParents()])
      .then(([studentData, parentData]) => {
        setStudents(studentData)
        setParents(parentData)
      })
      .catch(() => setMessage({ type: 'error', text: 'Data siswa gagal dimuat dari backend.' }))
      .finally(() => setStudentsLoading(false))
    return () => scannerControlsRef.current?.stop()
  }, [])

  const handleScannedValue = useCallback(async (rawValue) => {
    setRawScan(rawValue)
    setResolvingScan(true)
    setMessage(null)
    try {
      const identifier = await resolveStudentIdentifier(rawValue, students)
      if (!identifier) {
        setNis('')
        setMessage({ type: 'error', text: 'NISN tidak ditemukan dari isi barcode.' })
        return
      }
      setNis(identifier)
      setMessage({ type: 'success', text: `NISN ${identifier} berhasil dibaca dari barcode.` })
    } catch (error) {
      setNis('')
      setMessage({ type: 'error', text: error.message })
    } finally {
      setResolvingScan(false)
    }
  }, [students])

  useEffect(() => {
    if (!scannerOpen || !videoRef.current) return undefined
    let active = true

    const startScanner = async () => {
      try {
        const reader = new BrowserMultiFormatReader()
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        const preferredDevice = devices.find((device) => /back|rear|environment/i.test(device.label)) || devices[0]
        scannerControlsRef.current = await reader.decodeFromVideoDevice(
          preferredDevice?.deviceId,
          videoRef.current,
          (result) => {
            if (!active || !result) return
            const rawValue = result.getText().trim()
            if (/^https?:\/\//i.test(rawValue)) {
              setScannerOpen(false)
              scannerControlsRef.current?.stop()
              handleScannedValue(rawValue)
              return
            }
            const identifier = extractStudentIdentifier(rawValue)
            if (!identifier || identifier === '0') {
              setMessage({ type: 'error', text: `Barcode terbaca sebagai "${rawValue}". Pastikan barcode berisi NIS/NISN siswa.` })
              return
            }
            setNis(identifier)
            setRawScan(rawValue)
            setScannerOpen(false)
            scannerControlsRef.current?.stop()
          },
        )
      } catch {
        setMessage({ type: 'error', text: 'Kamera tidak dapat diakses. Masukkan NIS secara manual.' })
      }
    }
    startScanner()
    return () => { active = false; scannerControlsRef.current?.stop() }
  }, [handleScannedValue, scannerOpen])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (studentsLoading) {
      setMessage({ type: 'error', text: 'Data siswa masih dimuat. Coba lagi sebentar.' })
      return
    }

    setLoading(true)
    setMessage(null)
    setEmailStatus(null)
    let identifier
    try {
      identifier = await resolveStudentIdentifier(nis, students)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    if (!identifier) {
      setMessage({ type: 'error', text: `Isi QR "${nis}" tidak cocok dengan NIS siswa di database.` })
      setLoading(false)
      return
    }

    const student = students.find((item) => normalizeStudentIdentifier(item.nis) === identifier)
    if (!student) {
      setMessage({ type: 'error', text: `NIS/NISN ${identifier} tidak ditemukan di database.` })
      setLoading(false)
      return
    }

    try {
      const result = await submitAttendance(student.nis, type)
      setMessage({ type: 'success', text: `${result.pesan} ${student.nama_siswa}.` })
      setNis('')

      // Kirim notifikasi email ke orang tua — non-blocking, tidak gagalkan UI
      const parent = findParentByStudent(student, parents)
      if (parent?.email) {
        setEmailStatus('sending')
        const classData = student.kelas_id ? `Kelas ${student.kelas_id}` : '-'
        sendAttendanceNotification({
          studentName: student.nama_siswa,
          className: classData,
          parentName: parent.nama_ortu,
          parentEmail: parent.email,
          attendanceType: type,
        })
          .then(() => setEmailStatus('sent'))
          .catch(() => setEmailStatus('failed'))
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.8),_rgba(255,255,255,1)_35%,_#f5f7fb_100%)] px-4 py-8 text-slate-900 md:py-12">
      <main className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-slate-900 text-white shadow-lg"><ScanLine className="h-7 w-7" /></div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Absensi tanpa login</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-slate-900">Scan barcode siswa</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">Scanner menerima angka NISN langsung atau link ME-QR. Isi link akan dibaca lalu dicocokkan dengan field nis di database.</p>
        </div>

        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-8">
          {scannerOpen ? (
            <div className="overflow-hidden rounded-[24px] bg-slate-950">
              <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
              <button type="button" onClick={() => setScannerOpen(false)} className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white"><XCircle className="h-4 w-4" /> Tutup kamera</button>
            </div>
          ) : (
            <button type="button" onClick={() => setScannerOpen(true)} className="flex min-h-52 w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-blue-200 bg-blue-50/60 text-blue-700 transition hover:border-blue-400 hover:bg-blue-50">
              <Camera className="h-10 w-10" />
              <span className="mt-4 text-sm font-semibold">Buka kamera untuk scan</span>
              <span className="mt-1 text-xs text-blue-600/70">{studentsLoading ? 'Memuat data siswa...' : `${students.length} siswa siap dicocokkan`}</span>
            </button>
          )}

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400"><span className="h-px flex-1 bg-slate-200" /> atau masukkan manual <span className="h-px flex-1 bg-slate-200" /></div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700"><Keyboard className="mr-2 inline h-4 w-4" />NIS / NISN</span>
              <input value={nis} onChange={(event) => setNis(event.target.value)} inputMode="numeric" disabled={resolvingScan} placeholder={resolvingScan ? 'Mencari NISN...' : 'Contoh: 2026001'} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {['datang', 'pulang'].map((item) => <button key={item} type="button" onClick={() => setType(item)} className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${type === item ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>Jam {item}</button>)}
            </div>
            <button type="submit" disabled={loading || studentsLoading || !nis.trim()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{studentsLoading ? 'Menyiapkan data...' : loading ? 'Mencatat...' : 'Catat absensi'} <CheckCircle2 className="h-4 w-4" /></button>
          </form>

          {rawScan && <p className="mt-4 text-center text-xs text-slate-400">Hasil scan terakhir: {rawScan}</p>}

          {message && (
            <div className={`mt-5 rounded-2xl p-4 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              <div className="flex items-start gap-3">
                {message.type === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>{message.text}</span>
              </div>

              {/* Status pengiriman email notifikasi */}
              {message.type === 'success' && emailStatus && (
                <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                  emailStatus === 'sending' ? 'bg-blue-50 text-blue-600' :
                  emailStatus === 'sent'    ? 'bg-emerald-100 text-emerald-700' :
                                             'bg-amber-50 text-amber-600'
                }`}>
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {emailStatus === 'sending' && 'Mengirim notifikasi email ke orang tua...'}
                  {emailStatus === 'sent'    && 'Email notifikasi berhasil dikirim ke orang tua ✓'}
                  {emailStatus === 'failed'  && 'Email tidak terkirim — periksa konfigurasi EmailJS di .env'}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}