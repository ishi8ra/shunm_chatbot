import { Request, Response } from "express";
import { Server, Socket } from 'socket.io';
import nlp from 'compromise';

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
    
    const doc = nlp(message);

    if(doc.has('こんにちは')) {
      io.emit("receiveMessage", "こんにちはなのだ。");

    } else if(doc.has("こんばんは")) {
      io.emit("receiveMessage", "こんばんはであります。");

    } else if(doc.has("おはよう")){
      io.emit("receiveMessage", "おはようございます。");

    } else {
      io.emit("receiveMessage", "ちょっと何言ってるか分からない。");
    }

  });

  // ボットからのメッセージを受信したときの処理（フロントエンドで処理する場合）
  socket.on("receiveMessage", (message) => {
    // ここにフロントエンドでの処理を書く
  });
});


