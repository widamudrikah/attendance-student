import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/**
 * Kirim notifikasi email absensi ke orang tua siswa.
 *
 * @param {object} params
 * @param {string} params.studentName   - Nama siswa
 * @param {string} params.className     - Nama kelas siswa
 * @param {string} params.parentName    - Nama orang tua
 * @param {string} params.parentEmail   - Alamat email orang tua
 * @param {string} params.attendanceType - 'datang' atau 'pulang'
 * @returns {Promise<void>}
 */
export async function sendAttendanceNotification({
  studentName,
  className,
  parentName,
  parentEmail,
  attendanceType,
}) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('[EmailService] EmailJS belum dikonfigurasi. Cek file .env.')
    return
  }

  const now = new Date()
  const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const statusLabel = attendanceType === 'datang' ? 'Tiba di sekolah' : 'Pulang dari sekolah'

  const templateParams = {
    to_email: parentEmail,
    to_name: parentName,
    student_name: studentName,
    class_name: className,
    attendance_type: statusLabel,
    time,
    date,
  }

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
}
