type TUser = {
  userId: string;
  socketId: string;
  username: string;
};

export let USERS: TUser[] = [];

export const addUser = ({ userId, username, socketId }: TUser) => {
  if (!USERS.some((user) => user.userId === userId)) {
    USERS.push({ userId, socketId, username });
  }
};

export const getUser = (userId: string) => {
  return USERS.find((user) => user.userId === userId);
};

export const removeUser = (socketId: string) => {
  USERS = USERS.filter((user) => user.socketId !== socketId);
};
