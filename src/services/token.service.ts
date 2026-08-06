import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

import { env } from "../config/env.js";

export class TokenService {

    generateAccessToken(userId: number) {
        return jwt.sign(
            {
                sub: userId,
            },
            env.jwtSecret,
            {
                expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
            }
        );
    }

    generateRefreshToken() {
        return this.generateRandomToken();
    }

    hashRefreshToken(refreshToken: string) {
        return crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");
    }

    private generateRandomToken() {
        return crypto
            .randomBytes(64)
            .toString("hex");
    }

    getRefreshTokenExpirationDate() {
        const expiresAt =
            new Date();

        expiresAt.setDate(
            expiresAt.getDate() +
            env.refreshTokenExpiresInDays
        );

        return expiresAt;
    }
}