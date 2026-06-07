import "dotenv/config";
import { Router } from "express";
import * as UserController from "../controllers/UserController.ts";
export const userRouter = Router();

userRouter.post("/login", UserController.login);

userRouter.post("/register", UserController.register);
