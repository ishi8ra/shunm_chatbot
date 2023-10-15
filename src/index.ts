import { Request, Response } from "express";
import path from "path";
import { Server, Socket } from 'socket.io';

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  // res.sendFile(path.join(__dirname, 'src', 'index.html'));
  res.sendFile("/usr/src/app/src/index.html");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on("connection", (socket: Socket) => {
  console.log("user connected");
  socket.on("sendMessage", (message) => {
    console.log("Message has been sent: ", message);

    if (message.includes("こんにちは")) {
      io.emit("receiveMessage", "こんにちはなのだ");
    } else {
      io.emit("receiveMessage", message);
    }
  });
});
