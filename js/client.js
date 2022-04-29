const socket = io("https://nodeserver-chat-app.herokuapp.com/");

const form = document.getElementById("send-container");

const messageInput = document.getElementById("messageInp");

const messageContainer = document.querySelector(".container");

const fullApp = document.getElementById("full-app");

const nameApp = document.getElementById("name-app");

const nameForm = document.getElementById("name-container");

const nameInp = document.getElementById("nameInp");

const audio = new Audio("./assets/noti.mp3");

const html = document.getElementsByTagName("html")[0];

messageInput.focus();
nameInp.focus();

html.addEventListener("keypress", () => {
  messageInput.focus();
  nameInp.focus();
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
  if (socket.id) {
    const message = messageInput.value;
    if (!message) return;
    append(`You: ${message}`, "right", "normal");
    socket.emit("send", message);
    messageInput.value = "";
    messageContainer.scrollTop = messageContainer.scrollHeight;
    messageInput.focus();
  } else {
    fullApp.style.display = "none";
    nameApp.style.display = "block";
  }
});

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInp.value;

  if (name && name.length >= 3) {
    nameApp.style.display = "none";
    fullApp.style.display = "block";
    socket.emit("new-user-joined", name);
  } else {
    fullApp.style.display = "none";
    nameApp.style.display = "block";
    alert("Please give over 3 charecter Name");
  }
});

socket.on("user-joined", (name) => {
  append(`${name} join the chat`, "left", "love");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left", "normal");
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "left", "hate");
});
