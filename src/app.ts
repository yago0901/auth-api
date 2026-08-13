import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import healthRouter from "./routes/health.routes.js";
import { globalErrorHandler } from "./middlewares/global-error.middleware.js";
import {env} from "./config/env.js";
import { generalLimiter } from "./middlewares/rate-limit.middleware.js";

const app = express();

if (env.isProduction) {
    app.set("trust proxy", 1);
}

app.use(helmet());
app.use(cors({ origin: env.allowedOrigin }));

app.use(healthRouter);

app.use(generalLimiter);

app.use(express.json());
app.use(cookieParser());

app.use(authRouter);

app.use(globalErrorHandler);

export default app;