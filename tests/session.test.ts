import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import database from "../src/database/knex.js";
import { env } from "../src/config/env.js";
import { validUser, registerAndLogin, extractRefreshCookie } from "./helpers.js";

describe("POST /refresh", () => {

    it("gera um novo accessToken e um novo cookie", async () => {
        const { refreshCookie } = await registerAndLogin();

        const response = await request(app)
            .post("/refresh")
            .set("Cookie", refreshCookie);

        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).toBeTruthy();
        expect(response.body.data).not.toHaveProperty("refreshToken");

        const newCookie = extractRefreshCookie(response);
        expect(newCookie).not.toBe(refreshCookie);
    });

    it("revoga o token antigo (rotation)", async () => {
        const { refreshCookie } = await registerAndLogin();

        await request(app).post("/refresh").set("Cookie", refreshCookie);

        const replay = await request(app)
            .post("/refresh")
            .set("Cookie", refreshCookie);

        expect(replay.status).toBe(401);
        expect(replay.body.error.code).toBe("REFRESH_TOKEN_REVOKED");
    });

    it("recusa requisição sem cookie", async () => {
        const response = await request(app).post("/refresh");

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("REFRESH_TOKEN_REQUIRED");
    });

    it("recusa token inexistente", async () => {
        const response = await request(app)
            .post("/refresh")
            .set("Cookie", "refreshToken=token-que-nunca-existiu");

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("INVALID_REFRESH_TOKEN");
    });

    it("recusa token expirado", async () => {
        const { refreshCookie } = await registerAndLogin();

        await database("refresh_tokens").update({
            expires_at: new Date(Date.now() - 1000),
        });

        const response = await request(app)
            .post("/refresh")
            .set("Cookie", refreshCookie);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("REFRESH_TOKEN_EXPIRED");
    });
});

describe("POST /logout", () => {

    it("encerra a sessão e limpa o cookie", async () => {
        const { refreshCookie } = await registerAndLogin();

        const response = await request(app)
            .post("/logout")
            .set("Cookie", refreshCookie);

        expect(response.status).toBe(200);

        const setCookie = response.headers["set-cookie"] as unknown as string[];
        expect(setCookie.join()).toContain("refreshToken=;");
    });

    it("invalida o refresh token depois do logout", async () => {
        const { refreshCookie } = await registerAndLogin();

        await request(app).post("/logout").set("Cookie", refreshCookie);

        const response = await request(app)
            .post("/refresh")
            .set("Cookie", refreshCookie);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("REFRESH_TOKEN_REVOKED");
    });
});

describe("authMiddleware (via GET /profile)", () => {

    it("aceita um accessToken válido", async () => {
        const { accessToken } = await registerAndLogin();

        const response = await request(app)
            .get("/profile")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.user.username).toBe(validUser.username);
        expect(response.body.data.user).not.toHaveProperty("password_hash");
    });

    it("recusa requisição sem header Authorization", async () => {
        const response = await request(app).get("/profile");

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("AUTH_TOKEN_REQUIRED");
    });

    it("recusa formato que não é Bearer", async () => {
        const response = await request(app)
            .get("/profile")
            .set("Authorization", "Basic algumacoisa");

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("INVALID_AUTH_FORMAT");
    });

    it("recusa token corrompido", async () => {
        const response = await request(app)
            .get("/profile")
            .set("Authorization", "Bearer token-invalido");

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("INVALID_AUTH_TOKEN");
    });

    it("recusa token expirado", async () => {
        const expiredToken = jwt.sign({ sub: 1 }, env.jwtSecret, { expiresIn: "-1s" });

        const response = await request(app)
            .get("/profile")
            .set("Authorization", `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("INVALID_AUTH_TOKEN");
    });
});
