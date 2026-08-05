import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validade.middleware.js";
import { registerUserSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get("/users/count", authController.usersCount);

authRouter.post("/register", validate(registerUserSchema), authController.registerUser);

export default authRouter;