import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // MapLibre parses every vector tile in a Web Worker, and it spawns that
    // worker with `new Worker(new URL(..., import.meta.url))`. When Vite
    // pre-bundles the library into .vite/deps, that URL resolves relative to
    // the bundled file and the worker never runs — it is created, it accepts
    // messages, and it answers none of them. Tiles then sit in state
    // "loading" forever: no error, no request in the network panel (the
    // worker does the fetching), just an empty map painted in the style's
    // background colour. Serving MapLibre's own ESM instead keeps the worker
    // URL resolvable.
    exclude: ['maplibre-gl'],
  },
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
