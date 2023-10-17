import { Request, Response } from "express";
import { Server, Socket } from 'socket.io';
import nlp from 'compromise';
import mongoose from 'mongoose';
import User from './models/user';

const express = require("express");
const http = require("http");
const socketIo = require("socket.io"); 

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://root:password@mongo:27017/admin', { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
  })

// 静的ファイルを提供するディレクトリを設定
app.use(express.static('/app/src'));

app.get("/", (req: Request, res: Response) => {
  res.sendFile("/app/src/index.html");
});

app.post("/register", async (req: Request, res: Response) => {
  try {
    const { userName, userEmail } = req.body;
    const newUser = new User({
      userName,
      userEmail
    });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

interface UserInfo {
  input?: string;
}

let currentQuestion: string = "";
let userInfo: UserInfo = {};

// ユーザーが接続したときの処理
io.on("connection", (socket: Socket) => {
  console.log("user connected");

  io.emit("receiveMessage", "始めまして");

  currentQuestion = "名前を入力してください";
  io.emit("receiveMessage", currentQuestion);

  // メッセージを受信したときの処理
  socket.on("sendMessage", (message) => {
    console.log("Message has been sent: ", message);

    if (currentQuestion === "名前を入力してください") {
      currentQuestion = "メールアドレスを入力してください";
      io.emit("receiveMessage", currentQuestion);
    }
    
    userInfo["input"] = message;

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


