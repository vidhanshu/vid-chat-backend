import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./types";

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    access_token: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user model
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

// is valid password method
UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.access_token;

  return userObject;
};
const User = model<IUser>("User", UserSchema);
export default User;
