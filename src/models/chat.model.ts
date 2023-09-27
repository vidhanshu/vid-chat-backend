import { Schema, model } from "mongoose";

const ChatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    last_message: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", ChatSchema);

export default Chat;
