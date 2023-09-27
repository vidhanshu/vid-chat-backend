import { Router } from "express";

import { auth } from "../middlewares/auth.middleware";
import {
  GetChats,
  GetConversation,
  sendMessage,
} from "../controllers/chat.controller";

const ChatRouter = Router();

ChatRouter.get("/", auth, GetChats);
ChatRouter.get("/conversation/:userId", auth, GetConversation);
ChatRouter.post("/message/:userId", auth, sendMessage);

export default ChatRouter;
