import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My PWA App',
        short_name: 'PWA App',
        description: 'My awesome Progressive Web App!',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
      }
    })
  ],
  server: {
    allowedHosts: ['12ab70b9-e7f9-42e0-9618-d798b2e248c2-00-3t3fik8ln8y0l.janeway.replit.dev']
  }
})