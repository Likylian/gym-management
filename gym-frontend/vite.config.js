import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 对应SpringBoot地址
        changeOrigin: true
        // 注意：后端 Controller 均带 /api 前缀（如 /api/auth），
        // 因此不要重写路径，否则会 404。
      }
    }
  }
})