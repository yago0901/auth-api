const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error(
        "JWT_SECRET is not defined"
    );
}

export const env = { jwtSecret, jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h", };