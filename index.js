import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`working in the port:${PORT}`)
);

const FRONT_END_LINK = "http://localhost:3000";

const io = new Server(server, {
  cors: {
    origin: FRONT_END_LINK,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (roomNum) => {
    socket.join(roomNum);
    console.log(`user ${socket.id} has joined the room: ${roomNum}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("recived_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user left");
  });
});
