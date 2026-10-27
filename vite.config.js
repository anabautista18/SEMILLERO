import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/didi/',
  
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/didi/api': {
        target: 'http://localhost:4000',
        rewrite: path => path.replace(/^\/didi/, ''),
      },
      '/didi/uploads': {
        target: 'http://localhost:4000',
        rewrite: path => path.replace(/^\/didi/, ''),
      },
      '/didi/images': {
        target: 'http://localhost:4000',
        rewrite: path => path.replace(/^\/didi/, ''),
      },
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
      '/images': 'http://localhost:4000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
