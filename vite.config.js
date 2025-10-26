import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/giovanni-plan/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      manifest: {
        name: 'Plan diario',
        short_name: 'Plan',
        start_url: '/giovanni-plan/',
        scope: '/giovanni-plan/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          {
            src: '/giovanni-plan/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/giovanni-plan/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/giovanni-plan/maskable-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
