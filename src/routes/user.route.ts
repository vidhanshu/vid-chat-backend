import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { MyProfile } from "../controllers/user.controller";

const router = Router();

router.get("/me", auth, MyProfile);

export default router;
