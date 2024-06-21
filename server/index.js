const fs = require("fs");
const http = require("http");
// Express App Setup
const express = require("express");
require("dotenv").config();
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
app.use(cors());

app.use(bodyParser.json());
// const { pgClient } = require("./db");
const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/appointments");
const hospitalRoutes = require("./routes/hospital");
const homeRoutes = require("./routes/home");
const { extractToken } = require("./middlewares");

const io = new Server(server);

// app.use(sessionMiddleware);

// io.use(wrap(sessionMiddleware));
//Socket io
io.on("connection", (socket) => {
  console.log("a new user has connected", socket.id);
});

// io.on("connect", socket => {
//   initializeUser(socket);

//     socket.on("add_friend", (friendName,cb)=>{
//       addFriend(socket,friendName,cb)
//     })

//     socket.on("dm",(message)=>dm(socket,message))

//     socket.on("disconnecting",()=>onDisconnect(socket))
// });

// Express route handlers
app.get("/health", extractToken, async (req, res) => {
  return res.status(200).json({
    message: "Everything is good here! 👀",
  });
});
app.use("/auth", authRoutes);
app.use("/appointment", tokenRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/home", homeRoutes);

server.listen(6000, (err) => {
  console.log("Listening on PORT:", 6000);
});
