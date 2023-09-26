// Import the express in typescript file
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import morgan from "morgan";

import { PORT } from "./configs/env";
import { USERS, addUser, getUser, removeUser } from "./context";
import { connectDB } from "./configs/db";

import AuthRoutes from "./routes/auth.route";
import UserRoutes from "./routes/user.route";

// connect to db
connectDB();

// Initialize the express engine & socket
const app = express();
const server = http.createServer(app);
// TODO: in production only allow the frontend url
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO: in production only allow the frontend url
app.use(cors({ origin: "*" }));
app.use(morgan("tiny"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/server-health", (req, res) => {
  res.send("Server is up and running");
});
app.use(`/api/auth`, AuthRoutes);
app.use(`/api/users`, UserRoutes);

// Server setup
server.listen(PORT, () => {
  console.log("Server is up and running on PORT:", PORT);
});

//  socket setup
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on(
    "addUser",
    ({ username, userId }: { username: string; userId: string }) => {
      addUser({
        userId,
        socketId: socket.id,
        username,
      });
      console.log("[USERS]", USERS);

      io.emit("getUsers", USERS);
    }
  );

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
    removeUser(socket.id);
  });
});
