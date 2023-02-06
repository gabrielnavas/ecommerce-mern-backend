import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const PORT_SERVER = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: '*',
  methods: '*'
})

app.use(cors())
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

server.listen(PORT_SERVER, () => {
  console.log(`server running on port: ${PORT_SERVER}`)
})