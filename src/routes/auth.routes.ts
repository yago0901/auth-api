import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get("/", authController.home);

authRouter.get("/health", authController.health);

authRouter.get("/version", authController.version);

authRouter.get("/about", authController.about);

authRouter.get("/time", authController.time);

authRouter.get("/ping", authController.ping);

export default authRouter;