import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true binds to 0.0.0.0 so Vite prints the LAN IP as the
    // "Network:" URL — open that on a phone on the same Wi-Fi to try
    // the demo on a real device.
    host: true,
    port: 5173,
    // Vite does not open a browser on its own — this does.
    open: true,
  },
})
