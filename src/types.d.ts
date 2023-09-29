export type TMessage = {
  _id: string;
  chat: string;
  message: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
  sender: string;
  receiver: string;
  read?: boolean;
  deleted?: boolean;
  edited?: boolean;
};
