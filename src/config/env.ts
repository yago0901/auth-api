import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error(
        "JWT_SECRET is not defined"
    );
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

const refreshTokenExpiresInDays = Number( process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7 );

export const env = { jwtSecret, jwtExpiresIn, refreshTokenExpiresInDays };