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
import ChatRoutes from "./routes/chat.route";
import UploadRutes from "./routes/aws-upload.route";

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
app.use(`/api/chats`, ChatRoutes);
app.use(`/api/image`, UploadRutes);

// Server setup
server.listen(PORT, () => {
  console.log("Server is up and running on PORT:", PORT);
});

//  socket setup
io.on("connection", (socket) => {
  socket.on(
    "addUser",
    ({ username, userId }: { username: string; userId: string }) => {
      if (userId) {
        addUser({
          userId,
          socketId: socket.id,
          username,
        });

        const users: {
          [key: string]: boolean;
        } = {};

        USERS.forEach((user) => {
          users[user.userId] = true;
        });

        io.emit("getUsers", users);
      }
    }
  );

  socket.on(
    "sendMessage",
    ({
      message,
      receiver,
      sender,
    }: {
      message: string;
      receiver: string;
      sender: string;
    }) => {
      const receiverSocketId = getUser(receiver)?.socketId;
      const senderSocketId = getUser(sender)?.socketId;

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
          // TODO: currently returning the dummy id to match frontend message type
          _id: new Date().getTime().toString(),
          message,
          sender,
          receiver,
          createdAt: new Date().getTime(),
        });
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", {
          // TODO: currently returning the dummy id to match frontend message type
          _id: new Date().getTime().toString(),
          message,
          sender,
          receiver,
          createdAt: new Date().getTime(),
        });
      }
    }
  );

  socket.on("disconnect", () => {
    removeUser(socket.id);
    const users: {
      [key: string]: boolean;
    } = {};

    USERS.forEach((user) => {
      users[user.userId] = true;
    });
    io.emit("getUsers", users);
  });
});
