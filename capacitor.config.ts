import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.attandanceapp',
  appName: 'Attandance App',
  webDir: 'out',
  server: {
    url: 'https://attendance-student-eight.vercel.app/',
    cleartext: true
  }
};

export default config;
