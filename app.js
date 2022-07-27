const express = require("express");
const path = require("path");
var app = require("express")();
const http = require("http");
const io = require("./socket.js");

const server = http.createServer(app);

//USING STATIC FILES
app.use("/static", express.static(path.join(__dirname, "/static")));
app.use(express.urlencoded({ extended: true }));

//SETTING TEMPLATE ENGINES
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "templates"));


//SOCKET
const users = {};

io.connect(server);

//whenever there's a new connection
io.on("connection", (socket) => {
  //whenever a user joins through a connection
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    //telling others that someone joined
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("message-send", (message) => {
    socket.broadcast.emit("receive-message", { message: message, name: users[socket.id] });
  });
  
  socket.on("disconnect", (reason)=>{
    socket.broadcast.emit("user-left", {name: users[socket.id]});
  });
});


//ROUTING
app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.get("/about", (req, res) => {
  res.status(200).render("about");
});

const port = 3000;
server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
