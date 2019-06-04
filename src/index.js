import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  IN_PROD,
  APP_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
} from '../config'

const app = express()

app.disable('x-powered-by')
;(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true }
    )
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: !IN_PROD
    })

    server.applyMiddleware({ app })

    app.listen({ port: APP_PORT }, () => {
      console.log(`🚀  http://localhost:${APP_PORT}${server.graphqlPath}`)
    })
  } catch (err) {
    console.error(err)
  }
})()
