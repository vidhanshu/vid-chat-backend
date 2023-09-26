type TUser = {
  userId: string;
  socketId: string;
  username: string;
};

export const USERS: TUser[] = [];

export const addUser = ({ userId, username, socketId }: TUser) => {
  if (!USERS.some((user) => user.userId === userId)) {
    USERS.push({ userId, socketId, username });
  }
};

export const getUser = (userId: string) => {
  return USERS.find((user) => user.userId === userId);
};

export const removeUser = (socketId: string) => {
  USERS.splice(
    USERS.findIndex((user) => user.socketId === socketId),
    1
  );
};
