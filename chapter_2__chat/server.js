import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import chalk from "chalk"
import { v4 as uuid } from "uuid"
const app = express()
app.use(cors())
const server = http.createServer(app)

const PORT = 3000

const io = new Server(server, {
    cors: {
        origin: "http://localhost:1234",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

app.get("/", (req, res) => {
    res.sendStatus(200)
})

const messages = []

io.on("connection", socket => {

    socket.on("join", (params) => {
        const { username } = params
        console.log(`${username} joined`)

        socket.emit("newMessage", messages)

        socket.broadcast.emit("playerJoined", {
            player: username
        })

    })

    socket.on("message", (params) => {
        const {sender, content} = params
        console.log(`${sender.username} sent: "${content}"`)

        messages.push({
            sender, content, timestamp: Date.now(), id: uuid()
        })

        io.emit("newMessage", messages)
    })
})

server.listen(PORT, () => {
    console.log(chalk.green("[Express] Server is running on http://localhost:" + PORT))
})