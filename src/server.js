import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// mongo db
const connectionStr = process.env.MONGO_URL
mongoose.set('strictQuery', true)
mongoose.connect(connectionStr)
  .then(() => console.log('[ * ] - connected to mongod'))
  .catch(err => console.log(err))
  
mongoose.connection.on('error', err => {
  console.log(err)
})

// http server
const PORT_SERVER = process.env.PORT || 4000
const app = express()
const server = http.createServer(app)

// socket server
const io = new Server(server, {
  cors: '*',
  methods: '*'
})

// middles app
app.use(cors())
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

// start server
server.listen(PORT_SERVER, () => {
  console.log(`[ * ] - server running on port: ${PORT_SERVER}`)
})