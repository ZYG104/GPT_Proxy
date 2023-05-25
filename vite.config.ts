import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vuetify({
      // styles: { configFile: 'src/setting.scss' }
    }),
    AutoImport(
      {
        imports: [
          'vue',
          'pinia'
        ],
        vueTemplate: true,
        // 必须在 src 下，默认 true 生成的位置位于根目录下，无法被识别，可以跟 @ 路径设置有关
        dts: "./src/assets/auto-imports.d.ts",
      },
    ),
  ],
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "/src/assets/style/main.scss";',
      },
    },
  },
  server: {
    hmr: true,
    host: '0.0.0.0',
    port: 5499,
    proxy: {
      // 已弃用
      // '^/api': {
      //   target: 'http://192.168.0.101:3000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // },
      /**
       * 代理服务器设置，openai 不支持大陆地区IP访问，
       * 建议使用 美国 服务器配置代理访问 openai 接口
       */
      '^/original': {
        target: '你的代理服务器地址',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/original/, '')
      }
    }
  }
})


