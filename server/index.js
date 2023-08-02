const express = require("express");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
app.use(express.json());
__dirname = path.resolve();


  app.use(express.static(path.join(__dirname, "../client/build")));

  // handle all routes other than defined by us above
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..","client", "build", "index.html"));
  });


const io = new Server(8000, {
  cors: true,
  origin: "https://face-time.onrender.com",
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

// console.log("started");

io.on("connection", (socket) => {
  // console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    // console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    // console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server started on \n http://localhost:5000");
});