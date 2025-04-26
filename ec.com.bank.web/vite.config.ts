import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import path from 'path';

export default defineConfig(({ mode })=>({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      actions: path.resolve(__dirname, 'src/actions'),
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      config: path.resolve(__dirname, 'src/config'),
      constants: path.resolve(__dirname, 'src/constants'),
      dictionary: path.resolve(__dirname, 'src/dictionary'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      pages: path.resolve(__dirname, 'src/pages'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      routes: path.resolve(__dirname, 'src/routes'),
      store: path.resolve(__dirname, 'src/store'),
      service: path.resolve(__dirname, 'src/service'),
      utilities: path.resolve(__dirname, 'src/utilities'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      context: path.resolve(__dirname, 'src/context'),
      layouts: path.resolve(__dirname, 'src/layouts'),
    }
  },
  server: { fs: { allow: ['.', '../shared'] }, open: true },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  json: {
    stringify: true,
  },
  build: {
    target: 'chrome89',
    minify: mode === 'production'
  }
}));
