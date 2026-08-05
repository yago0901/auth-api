import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateUser } from "../middlewares/validade.middleware.js";
import { loginSchema, registerUserSchema } from "../schemas/auth.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get("/users/count", authController.usersCount);

authRouter.post("/register", validateUser(registerUserSchema), authController.registerUser);

authRouter.post("/login", validateUser(loginSchema), authController.login);

authRouter.get("/profile", authMiddleware, authController.profile);

export default authRouter;