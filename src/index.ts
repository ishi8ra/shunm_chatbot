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

// 静的ファイルを提供するディレクトリを設定
app.use(express.static('/app/src'));

app.get("/", (req: Request, res: Response) => {
  res.sendFile("/app/src/index.html");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// ユーザーが接続したときの処理
io.on("connection", (socket: Socket) => {
  console.log("user connected");

  // メッセージを受信したときの処理
  socket.on("sendMessage", (message) => {
    console.log("Message has been sent: ", message);

    if (message.includes("こんにちは")) {
      io.emit("receiveMessage", "こんにちはなのだ");
    } else {
      io.emit("receiveMessage", message);
    }
  });

  // ボットからのメッセージを受信したときの処理（フロントエンドで処理する場合）
  socket.on("receiveMessage", (message) => {
    // ここにフロントエンドでの処理を書く
  });
});

// メッセージをDOMに追加する関数
const addMessageList = (message: string, className: string) => {
  const ul = document.getElementById("messageList");
  if (ul) {
    const li = document.createElement("li");
    li.className = className;
    const text = document.createTextNode(message);
    li.appendChild(text);
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
  }
};
