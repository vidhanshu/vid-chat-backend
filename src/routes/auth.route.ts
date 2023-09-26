import express from "express";

import { SignIn, signUp, SignOut } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";

const AuthRouter = express.Router();

AuthRouter.post("/sign-up", signUp);
AuthRouter.post("/sign-in", SignIn);
AuthRouter.post("/sign-out", auth, SignOut);

export default AuthRouter;
