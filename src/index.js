import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'

import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'
import {
  IN_PROD,
  APP_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} from '../config'

const app = express()
app.disable('x-powered-by')
;(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true }
    )
    const RedisStore = connectRedis(session)
    const store = new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT,
      pass: REDIS_PASSWORD
    })
    /*
      resave: re-save the session to store
      rolling: update session lifetime
      cookie: {
        sameSite: Related with CSRF attacks
        httpOnly: clients will not allow client-side JavaScript
                  to see the cookie in document.cookie
      }
    */
    app.use(
      session({
        store,
        name: SESS_NAME,
        secret: SESS_SECRET,
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
          maxAge: parseInt(SESS_LIFETIME),
          sameSite: true,
          secure: IN_PROD,
          httpOnly: true
        }
      })
    )
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: IN_PROD
        ? false
        : { settings: { 'request.credentials': 'include' } },
      context: ({ req, res }) => ({ req, res })
    })

    server.applyMiddleware({ app, cors: false })

    app.listen({ port: APP_PORT }, () => {
      console.log(`🚀  http://localhost:${APP_PORT}${server.graphqlPath}`)
    })
  } catch (err) {
    console.error(err)
  }
})()
