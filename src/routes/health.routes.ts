import { Router } from "express";

import database from "../database/knex.js";
import { sendSuccess } from "../utils/http-response.js";
import { AppError } from "../errors/app-errors.js";

const healthRouter = Router();

healthRouter.get("/health", async (req, res) => {
    try {
        await database.raw("SELECT 1");
    } catch {
        throw new AppError(
            "Database unavailable",
            503,
            "DATABASE_UNAVAILABLE"
        );
    }

    return sendSuccess(res, { status: "ok" });
});

export default healthRouter;