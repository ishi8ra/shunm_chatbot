"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socketIo(server);
const PORT = 3000;
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'src', 'index.html'));
});
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("sendMessage", (message) => {
        console.log("Message has been sent: ", message);
        if (message.includes("こんにちは")) {
            io.emit("receiveMessage", "こんにちはなのだ");
        }
        else {
            io.emit("receiveMessage", message);
        }
    });
});
