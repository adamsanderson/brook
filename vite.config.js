import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: 'src/manifest.json'
    })
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      stream: 'stream-browserify',
    }
  },
  
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
    Buffer: 'Buffer'
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'redux', 'react-redux', 'feedme', 'buffer', 'stream-browserify']
  }
})