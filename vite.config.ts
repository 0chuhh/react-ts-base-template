import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  resolve: {
    alias:{
      app: `${path.resolve(__dirname, "./src/app/")}`,
      routes: `${path.resolve(__dirname, "./src/routes/")}`,
      assets: `${path.resolve(__dirname, "./src/assets/")}`,
      components: `${path.resolve(__dirname, "./src/components/")}`,
      modules: `${path.resolve(__dirname, "./src/components/modules/")}`,
      models: `${path.resolve(__dirname, "./src/models/")}`,
      layout: `${path.resolve(__dirname, "./src/components/layout/")}`,
      ui: `${path.resolve(__dirname, "./src/components/ui/")}`,
      public: `${path.resolve(__dirname, "./public/")}`,
      pages: path.resolve(__dirname, "./src/pages"),
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/app/styles/_index.scss";`
      }
    }
  },
})