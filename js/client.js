const socket = io("https://nodeserver-chat-app.herokuapp.com/");

const form = document.getElementById("send-container");

const messageInput = document.getElementById("messageInp");

const messageContainer = document.querySelector(".container");

const audio = new Audio("./assets/noti.wav");

const html = document.getElementsByTagName("html")[0];

html.addEventListener("keypress", () => {
  messageInput.focus();
});

const append = (message, position, color) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageElement.classList.add(color);
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  if (position === "left") {
    audio.play();
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (!message) return;
  append(`You : ${message}`, "right", "normal");
  socket.emit("send", message);
  messageInput.value = "";
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

const name = prompt("Enter your name plz! Must be over 3 charecter.");

if (name && name.length >= 3) {
  socket.emit("new-user-joined", name);
} else {
  location.href = "./-nodeServer-chat-app";
}

socket.on("user-joined", (name) => {
  append(`${name} join the chat`, "left", "love");
});

socket.on("receive", (data) => {
  append(`${data.name} : ${data.message}`, "left", "normal");
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "left", "hate");
});
