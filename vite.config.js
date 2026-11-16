import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    proxy: {
      '/api/genzdealz': {
        target: 'https://api.genzdealz.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/genzdealz/, ''),
        secure: true
      }
    }
  }
});
