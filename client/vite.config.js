import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['CSD-c-dark-removebg-preview.png'],
      manifest: {
        name: 'Campus Service Desk',
        short_name: 'CampusDesk',
        description: 'A unified campus facility complaint tracking and resolution platform.',
        theme_color: '#ea580c',
        background_color: '#fffdfa',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/CSD-c-dark-removebg-preview.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/CSD-c-dark-removebg-preview.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
})
