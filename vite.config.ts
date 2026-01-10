import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
  server: {
    proxy: {
      // Proxy untuk menghindari CORS error di development
      // Semua request ke /api akan di-proxy ke backend
      '/api': {
        target: 'https://vendortest.siloamhospitals.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/tender/api'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            )
          })
        },
      },
    },
  },
})
