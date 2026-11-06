import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 使用相对路径，确保在 GitHub Pages 子路径下也能正常工作
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
