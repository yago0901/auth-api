import { NextFunction, Request, Response, } from "express";
import { ZodType, } from "zod";
import { AppError } from "../errors/app-errors.js";

export function validateUser(schema: ZodType) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
            throw new AppError(
                "Validation error",
                400,
                "VALIDATION_ERROR",
                result.error.flatten().fieldErrors
            );
        }

        req.body = result.data;

        return next();
    };
}