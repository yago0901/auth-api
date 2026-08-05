import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateUser } from "../middlewares/validade.middleware.js";
import { registerUserSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get("/users/count", authController.usersCount);

authRouter.post("/register", validateUser(registerUserSchema), authController.registerUser);

export default authRouter;