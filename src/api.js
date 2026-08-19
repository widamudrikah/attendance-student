const API_BASE_URL = 'https://backend-absensi-production-1702.up.railway.app'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || payload.pesan || 'Permintaan ke server gagal.')
  }

  return payload
}

export async function getStudents() {
  const payload = await request('/api/siswa')
  return payload.data || []
}

export async function getClasses() {
  const payload = await request('/api/kelas')
  return payload.data || []
}

export async function getParents() {
  const payload = await request('/api/orang_tua')
  return payload.data || []
}

export async function getTeachers() {
  const payload = await request('/api/guru')
  return payload.data || []
}

export async function getUsers() {
  const payload = await request('/api/users')
  return payload.data || []
}

export async function getSchedules() {
  const payload = await request('/api/jadwal_mengajar')
  return payload.data || []
}

export async function getStudentAttendances() {
  const payload = await request('/api/absensi_siswa')
  return payload.data || []
}

export async function getTeacherAttendances() {
  const payload = await request('/api/absensi_guru')
  return payload.data || []
}

export async function submitAttendance(nis, tipeAbsen) {
  return request('/api/absen', {
    method: 'POST',
    body: JSON.stringify({ nis: String(nis), tipe_absen: tipeAbsen }),
  })
}

export function normalizeStudent(student, classes = []) {
  const classData = classes.find((item) => item.id === student.kelas_id)
  return {
    id: student.id,
    nis: student.nis,
    name: student.nama_siswa,
    className: classData?.nama_kelas || `Kelas ${student.kelas_id}`,
    classId: student.kelas_id,
    parentId: student.orang_tua_id,
  }
}

/**
 * Cari data orang tua berdasarkan relasi orang_tua_id dari siswa.
 * Mengembalikan { id, nama_ortu, email } atau null jika tidak ditemukan.
 *
 * @param {object} student  - Objek siswa dari backend (dengan orang_tua_id)
 * @param {Array}  parents  - Array data orang tua dari /api/orang_tua
 * @returns {{ id: number, nama_ortu: string, email: string } | null}
 */
export function findParentByStudent(student, parents = []) {
  if (!student?.orang_tua_id) return null
  return parents.find((parent) => parent.id === student.orang_tua_id) ?? null
}

export function formatTime(value) {
  return value ? value.slice(0, 5) : '-'
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function dateKey(value) {
  return value ? value.slice(0, 10) : ''
}

export function normalizeStudentIdentifier(value) {
  return String(value ?? '').trim().replace(/^0+(?=\d)/, '')
}

export function extractStudentIdentifier(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return ''
  if (/^\d+$/.test(raw)) return normalizeStudentIdentifier(raw)

  try {
    const parsed = JSON.parse(raw)
    const embeddedValue = parsed.nis ?? parsed.nisn ?? parsed.nis_siswa ?? parsed.studentNis
    if (embeddedValue) return normalizeStudentIdentifier(embeddedValue)
  } catch {}

  const numericValue = raw.match(/(?:nisn?|nis_siswa|student(?:_nis)?)[\s:=/-]*(\d+)/i)?.[1] || raw.match(/\d+/)?.[0]
  return normalizeStudentIdentifier(numericValue || raw)
}

export async function resolveStudentIdentifier(value, students) {
  const directIdentifier = extractStudentIdentifier(value)
  if (directIdentifier) return directIdentifier

  const rawUrl = String(value ?? '').trim()
  if (!/^https?:\/\//i.test(rawUrl)) return ''

  const readerUrl = `https://r.jina.ai/http://${rawUrl.replace(/^https?:\/\//i, '')}`
  const response = await fetch(readerUrl)
  if (!response.ok) throw new Error('Isi link QR tidak dapat dibaca otomatis.')
  const content = await response.text()
  const matchedStudent = students.find((student) => content.includes(String(student.nis)))
  return matchedStudent ? normalizeStudentIdentifier(matchedStudent.nis) : ''
}