import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    codeInspectorPlugin({
      bundler: 'vite',
      // 设置为 true 时，仅当 .env.local 文件存在且其包含 CODE_INSPECTOR=true 时插件生效
      needEnvInspector: false
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
