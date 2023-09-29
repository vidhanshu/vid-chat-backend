import mongoose from "mongoose";
import { Response } from "express";

import { IGetUserAuthInfoRequest } from "../@types/types";
import Message from "../models/message.model";
import Chat from "../models/chat.model";
import {
  ResponseError,
  ReturnCatchedErrorResponse,
  sendResponse,
} from "../utils/response";

export async function GetConversation(
  req: IGetUserAuthInfoRequest,
  res: Response
) {
  try {
    const userId = req.user?._id;
    const otherUserId = req.params.userId;
    if (!userId || !otherUserId) {
      throw new ResponseError("Invalid data", 400);
    }

    const messages = await Message.find({
      $or: [
        { $and: [{ sender: userId }, { receiver: otherUserId }] },
        { $and: [{ sender: otherUserId }, { receiver: userId }] },
      ],
    });

    sendResponse(res, { data: messages });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function GetChats(req: IGetUserAuthInfoRequest, res: Response) {
  try {
    const userId = req.user?._id;

    console.log(userId);
    if (!userId) {
      throw new ResponseError("Unauthorized", 401);
    }

    const chats = await Chat.find({
      participants: { $in: [userId] },
    })
      .sort({ createdAt: -1 })
      .populate("participants")
      .populate("last_message");

    sendResponse(res, { data: chats });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function sendMessage(req: IGetUserAuthInfoRequest, res: Response) {
  try {
    const senderId = req.user?._id;
    const receiverId = req.params.userId;
    const message = req.body.message;
    if (!senderId || !receiverId || !message)
      throw new ResponseError(
        "Message, senderId or ReceiverId is missing",
        400
      );

    if (senderId.toString() === receiverId) {
      throw new ResponseError("You cannot send message to yourself", 400);
    }

    // update chat if it exists or create a new one
    const chat = await Chat.findOneAndUpdate(
      {
        participants: {
          $all: [
            {
              $elemMatch: { $eq: new mongoose.Types.ObjectId(senderId) },
            },
            {
              $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) },
            },
          ],
        },
      },
      {
        $set: { last_message: message, participants: [senderId, receiverId] },
      },
      { new: true, upsert: true }
    );

    // create a new message
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message,
      chat: chat._id,
    });

    sendResponse(res, { data: newMessage });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function EditMessage(req: IGetUserAuthInfoRequest, res: Response) {
  try {
    const messageId = req.params.messageId;
    const message = req.body.message;
    const userId = req.user?._id;

    if (!messageId || !message || !userId)
      throw new ResponseError("Invalid data", 400);

    const existingMessage = await Message.findById(messageId);

    if (!existingMessage) throw new ResponseError("Message not found", 404);
    if (existingMessage.sender.toString() !== userId.toString())
      throw new ResponseError("You cannot edit this message", 403);
    if (existingMessage.deleted)
      throw new ResponseError("Deleted message can't be edited", 400);

    existingMessage.message = message;

    const chat = await Chat.findById(existingMessage.chat);
    if (chat) {
      chat.last_message = "Message was edited";
      await chat.save();
    }

    await existingMessage.save();
    sendResponse(res, { message: "Message Edited Successfully" });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function DeleteMessage(
  req: IGetUserAuthInfoRequest,
  res: Response
) {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?._id;

    if (!messageId || !userId) throw new ResponseError("Invalid data", 400);

    const existingMessage = await Message.findById(messageId);

    if (!existingMessage) throw new ResponseError("Message not found", 404);

    if (existingMessage.sender.toString() !== userId.toString())
      throw new ResponseError("You cannot delete this message", 403);
    if (existingMessage.deleted)
      throw new ResponseError("Message already deleted", 400);

    existingMessage.deleted = true;
    existingMessage.message = "This message has been deleted";

    const chat = await Chat.findById(existingMessage.chat);
    if (chat) {
      chat.last_message = "message was deleted";
      await chat.save();
    }

    await existingMessage.save();
    sendResponse(res, { message: "Message deleted successfully" });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}
