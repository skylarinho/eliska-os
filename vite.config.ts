import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { sestavObsah, vypisHlaseni } from './scripts/obsah.ts'

/** V `npm run dev` převádí obsah z markdownu při startu a při každé změně v obsah/. */
function obsahPlugin(): Plugin {
  return {
    name: 'eliska-obsah',
    apply: 'serve',
    configureServer(server) {
      const log = {
        log: (z: string) => server.config.logger.info(z),
        warn: (z: string) => server.config.logger.warn(z),
        error: (z: string) => server.config.logger.error(z),
      }
      const preved = () => {
        const v = sestavObsah()
        vypisHlaseni(v, v.lekce.length, log)
      }
      preved()
      server.watcher.add('obsah')
      const zmena = (soubor: string) => {
        if (soubor.replaceAll('\\', '/').includes('/obsah/')) preved()
      }
      server.watcher.on('add', zmena).on('change', zmena).on('unlink', zmena)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), obsahPlugin()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
