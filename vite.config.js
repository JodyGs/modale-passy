import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Documentation : https://vite.dev/guide/build#library-mode
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'style',
    },
    rolldownOptions: {
      // React n'est pas embarqué dans le paquet : c'est l'application hôte qui le fournit.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
