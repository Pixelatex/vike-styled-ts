require('dotenv').config({ path: './.env.local' })
import express from 'express'
import apollo from '@apollo/client'
import { renderPage } from 'vike/server'
import { root } from './root.js'

const { ApolloClient, createHttpLink, InMemoryCache } = apollo

const isProduction = process.env.NODE_ENV === 'production'
const gqlURI = process.env.PUBLIC_ENV__GQL_ENDPOINT
const port = process.env.PORT || 3002

startServer()
console.log('start')
async function startServer() {
  const app = express()
  // auth(app)
  await assets(app)
  vike(app)
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

async function assets(app) {
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }
}

function vike(app) {
  app.get('*', async (req, res, next) => {
    const apolloClient = createApolloClient()

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      apolloClient,
    }

    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) {
      return next()
    } else {
      const { statusCode, headers, earlyHints } = httpResponse
      if (res.writeEarlyHints)
        res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode)
      httpResponse.pipe(res)
    }
  })
}

const createApolloClient = () => {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: gqlURI,
      fetch,
    }),
    cache: new InMemoryCache(),
  })
  return apolloClient
}
