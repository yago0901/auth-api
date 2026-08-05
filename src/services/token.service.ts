import jwt, { SignOptions } from "jsonwebtoken";

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
}