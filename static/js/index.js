const socket = io();

const container = document.getElementById("container");
const form = document.getElementById("form");
const messageField = document.getElementById("input");
const audio = new Audio("/static/noti-sound.mp3");
audio.autoplay = true;

//append function to create the message element
const append = (message, position)=>{
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    container.append(messageElement);
    if(position == "left"){
        audio.play();
    }
}

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(messageField.value === "") return;
    const message = messageField.value.trim();
    append(`You: ${message}`, "right");

    //for others to recieve the message
    socket.emit("message-send", message, "left");
    messageField.value = "";
});

const name = prompt("Enter name you want to join as");

//as soon as the user enters the name, the function with same name will be run
socket.emit("new-user-joined", name);

socket.on("user-joined", (name)=>{
    append(`${name} joined the chat`, "left");
});

//as soon as someone sends the message
socket.on("receive-message", ({message, name})=>{
    append(`${name}: ${message}`, 'left');
})

socket.on("user-left", ({name})=>{
    append(`${name} has left the chat`, "left")
});
