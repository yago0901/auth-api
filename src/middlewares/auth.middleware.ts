import { NextFunction, Request, Response, } from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-errors.js";


export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        throw new AppError(
            "Authorization token is required",
            401,
            "AUTH_TOKEN_REQUIRED"
        );
    }

    const [type, token] = authorizationHeader.split(" ");

    if (
        type !== "Bearer" ||
        !token
    ) {
        throw new AppError(
            "Invalid authorization format",
            401,
            "INVALID_AUTH_FORMAT"
        );
    }

    try {
        const decoded = jwt.verify( token, env.jwtSecret );

        if (
            typeof decoded === "string"
        ) {
            throw new AppError(
                "Invalid authentication token",
                401,
                "INVALID_AUTH_TOKEN"
            );
        }

        const userId = Number(decoded.sub);

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            throw new AppError(
                "Invalid authentication token",
                401,
                "INVALID_AUTH_TOKEN"
            );
        }

        req.userId = userId;

        return next();
    } catch (error) {
        if (
            error instanceof AppError
        ) {
            throw error;
        }

        throw new AppError(
            "Invalid or expired token",
            401,
            "INVALID_AUTH_TOKEN"
        );
    }
}