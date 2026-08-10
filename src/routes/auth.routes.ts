import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateUser } from "../middlewares/validade.middleware.js";
import { loginSchema, registerUserSchema } from "../schemas/auth.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get("/users/count", authController.usersCount);

authRouter.post("/register", authLimiter, validateUser(registerUserSchema), authController.registerUser);

authRouter.post("/login", authLimiter, validateUser(loginSchema), authController.login);

authRouter.get("/profile", authMiddleware, authController.profile);

authRouter.post("/refresh", authController.refresh);

authRouter.post("/logout", authController.logout);

export default authRouter;