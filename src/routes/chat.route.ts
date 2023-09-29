import { Router } from "express";

import { auth } from "../middlewares/auth.middleware";
import {
  DeleteMessage,
  EditMessage,
  GetChats,
  GetConversation,
  sendMessage,
} from "../controllers/chat.controller";

const ChatRouter = Router();

ChatRouter.get("/", auth, GetChats);
ChatRouter.get("/conversation/:userId", auth, GetConversation);
ChatRouter.post("/message/:userId", auth, sendMessage);
ChatRouter.patch("/message/:messageId", auth, EditMessage);
ChatRouter.delete("/message/:messageId", auth, DeleteMessage);

export default ChatRouter;
