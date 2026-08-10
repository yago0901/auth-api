import { Response } from "express";
import { env } from "../config/env.js";

const REFRESH_TOKEN_COOKIE = "refreshToken";

export function setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? "none" : "lax",
        path: "/",
        maxAge: env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
    });
}

export function clearRefreshTokenCookie(res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });
}