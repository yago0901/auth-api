import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error(
        "JWT_SECRET is not defined"
    );
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

const refreshTokenExpiresInDays = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7);

const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3030";

const isProduction = process.env.NODE_ENV === "production";

const isTest = process.env.NODE_ENV === "test";

if (isProduction && !process.env.ALLOWED_ORIGIN) {
    throw new Error(
        "ALLOWED_ORIGIN must be defined in production"
    );
}

export const env = { jwtSecret, jwtExpiresIn, refreshTokenExpiresInDays, allowedOrigin, isProduction, isTest };