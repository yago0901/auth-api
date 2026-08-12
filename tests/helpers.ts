import request from "supertest";

import app from "../src/app.js";

export const validUser = {
    first_name: "Maria",
    last_name: "Silva",
    username: "mariasilva",
    gender: "female",
    email: "maria@example.com",
    password: "senha12345",
};

export function extractRefreshCookie(response: request.Response) {
    const setCookie = response.headers["set-cookie"] as unknown as string[] | undefined;

    const raw = (setCookie ?? []).find((cookie) => cookie.startsWith("refreshToken="));

    if (!raw) {
        throw new Error("refreshToken cookie not found in response");
    }

    return raw.split(";")[0];
}

export async function registerAndLogin() {
    await request(app).post("/register").send(validUser);

    const login = await request(app)
        .post("/login")
        .send({ username: validUser.username, password: validUser.password });

    return {
        accessToken: login.body.data.accessToken as string,
        refreshCookie: extractRefreshCookie(login),
    };
}
