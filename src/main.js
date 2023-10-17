// サーバーへ接続
const socket = io();

const clearText = () => {
  document.getElementById("inputText").value = "";
};

const addMessageList = (message, className) => {
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

let currentQuestion = "";

document.getElementById("sendButton").addEventListener("click", () => {
  let inputMessage = document.getElementById("inputText").value;
  if (inputMessage === "") {
    return;
  }
  addMessageList(inputMessage, "user-message");
  socket.emit("sendMessage", inputMessage);
  clearText();

  /// ユーザー入力を記入欄に反映させる。///
  if (currentQuestion === "名前を入力してください") {
    document.getElementById("userName").innerText = inputMessage;
  } else if (currentQuestion === "メールアドレスを入力してください") {
    document.getElementById("userEmail").innerText = inputMessage;
  }
});

socket.on("receiveMessage", (message) => {
  addMessageList(message, "bot-message");
  currentQuestion = message;
});

document.getElementById("registerButton").addEventListener("click", async () => {
  const userName = document.getElementById("registerName").value;
  const userEmail = document.getElementById("registerEmail").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, userEmail }),
  });

  const data = await response.json();
  console.log("data's message: ", data.message);
});
