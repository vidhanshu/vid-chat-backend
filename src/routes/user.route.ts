import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  SearchUser,
  MyProfile,
  UpdateUser,
} from "../controllers/user.controller";

const router = Router();

router.patch("/update", auth, UpdateUser);

router.get("/me", auth, MyProfile);
router.get("/", auth, SearchUser);

export default router;
