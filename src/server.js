const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const mongoose = require('mongoose')
const dotenv = require('dotenv')

const userRouter = require('./routes/userRoutes')

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

// controllers
app.use(userRouter)

// start server
server.listen(PORT_SERVER, () => {
  console.log(`[ * ] - server running on port: ${PORT_SERVER}`)
})