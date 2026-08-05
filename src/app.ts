import express from "express";
import authRouter from "./routes/auth.routes.js";
import { globalErrorHandler } from "./middlewares/global-error.middleware.js";

const app = express();

app.use(express.json());

app.use(authRouter);

app.use(globalErrorHandler);

export default app;