import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get("/users/count", authController.usersCount);

authRouter.post("/register", authController.registerUser);

export default authRouter;