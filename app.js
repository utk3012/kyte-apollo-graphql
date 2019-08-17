import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
// const Post = require('./resolvers/Post')

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')

dotenv.config()

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        User
    },
    context({ req }) {
        return { req }
    },
    playground: true
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}-suy8u.mongodb.net/kyte?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })