import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-errors.js";

export function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
        });
    }

    console.error(error);

    return res.status(500).json({
        message: "Erro interno do servidor",
        code: "INTERNAL_SERVER_ERROR",
    });
}