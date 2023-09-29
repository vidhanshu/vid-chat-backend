export type TMessage = {
  _id: string;
  chat: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  sender: string;
  receiver: string;
  read?: boolean;
  deleted?: boolean;
  edited?: boolean;
};
