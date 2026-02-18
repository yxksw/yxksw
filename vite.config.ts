import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from "vite-plugin-html";
import config from "./config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createHtmlPlugin({
    inject: {
      data: {
        title: config.SiteHead.Title,
        favicon: config.SiteHead.Favicon,
        keywords: config.SiteHead.KeyWords,
        desc: config.SiteHead.Desc,
        background: config.SiteBackground,
      },
    },
  })],
  server: {
    proxy: {
      '/bili': {
        target: 'https://api.bilibili.com',
        headers: {
          "referer": "https://space.bilibili.com/"
        },
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bili/, '')
      },
      '/api/atom': {
        target: 'https://cofe.050815.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/atom/, '/atom.xml')
      }
    }
  }
})
