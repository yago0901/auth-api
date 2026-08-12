import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.isTest ? 10_000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.isTest ? 10_000 : 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            message: "Too many attempts, please try again later",
            code: "TOO_MANY_REQUESTS",
        },
    },
});