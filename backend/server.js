import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { socketHandlers } from "./sockets/socket.handle.js";
import quizRoutes from "./routes/quiz.routes.js";
import { mongoDB } from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 6000;

//Mongo connection
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRoutes);

// The socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socketHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoDB();
});
