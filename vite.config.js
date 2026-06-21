import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import gamesHandler from './api/games.js'
import playerHandler from './api/player.js'
import searchHandler from './api/search.js'

const API_HANDLERS = {
  '/api/games':  gamesHandler,
  '/api/player': playerHandler,
  '/api/search': searchHandler,
}

// Runs the Vercel-style serverless handlers inside Vite's dev server.
// Shims the subset of req/res that the handlers actually use.
function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const handler = API_HANDLERS[url.pathname]
        if (!handler) return next()

        req.query = Object.fromEntries(url.searchParams)
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }

        try {
          await handler(req, res)
        } catch (err) {
          console.error('[local-api]', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
})
