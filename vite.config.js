import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: 'src/manifest.json',
      additionalInputs: [
        'src/Import/index.html',
        'src/Popup/index.html',
        'src/SubscribePopup/index.html',
      ],
      webExtConfig: {
        target: "firefox-desktop",
        devtools: true,
        startUrl: "about:debugging#/runtime/this-firefox",
      }
    }),
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Enable polyfill for specific modules  
      protocolImports: true,
    })
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'redux', 'react-redux', 'feedme']
  }
})