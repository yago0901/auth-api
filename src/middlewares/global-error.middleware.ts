import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-errors.js";

export function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: error.code,
                ...(error.details !== undefined && { details: error.details }),
            },
        });
    }

    console.error(error);

    return res.status(500).json({
        error: {
            message: "Internal server error",
            code: "INTERNAL_SERVER_ERROR",
        },
    });
}