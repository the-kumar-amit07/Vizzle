import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from "http"
import { Server } from "socket.io"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())


//Setup routes
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import roomRouter from "./routes/room.routes.js"


app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/rooms", roomRouter)

const server = createServer(app)
//Setup socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`)
    //joining room
    socket.on("joinRoom", (roomId) => {
        console.log(`User ${socket.id} joined room : ${roomId}`);
        socket.join(roomId)
        io.to(roomId).emit("message",`User ${socket.id} joined the room.`)  //emit means send
    })
    //leave room
    socket.on("leaveRoom", (roomId) => {
        console.log(`User ${socket.id} left room : ${roomId}`);
        socket.leave(roomId)
        io.to(roomId).emit("message",`User ${socket.id} left the room.`);
    })
    //send message to room
    socket.on("sendMessage", ({ roomId,message }) => {
        console.log(`Message from ${socket.id} to room ${roomId}: ${message}`);
        io.to(roomId).emit("message",{userId:socket.id,message})
    })
    //disconnect
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    })
})


export {server}