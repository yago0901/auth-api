import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { globalErrorHandler } from "./middlewares/global-error.middleware.js";
import {env} from "./config/env.js";
import { generalLimiter } from "./middlewares/rate-limit.middleware.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.allowedOrigin }));
app.use(generalLimiter);

app.use(express.json());

app.use(authRouter);

app.use(globalErrorHandler);

export default app;