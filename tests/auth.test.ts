import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";
import { validUser } from "./helpers.js";

describe("POST /register", () => {

    it("cria um usuário e não devolve a senha", async () => {
        const response = await request(app)
            .post("/register")
            .send(validUser);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.username).toBe("mariasilva");
        expect(response.body.data).not.toHaveProperty("password");
        expect(response.body.data).not.toHaveProperty("password_hash");
    });

    it("recusa username duplicado", async () => {
        await request(app).post("/register").send(validUser);

        const response = await request(app)
            .post("/register")
            .send(validUser);

        expect(response.status).toBe(409);
        expect(response.body.error.code).toBe("USER_ALREADY_EXISTS");
    });

    it("recusa email duplicado", async () => {
        await request(app).post("/register").send(validUser);

        const response = await request(app)
            .post("/register")
            .send({ ...validUser, username: "outrousuario" });

        expect(response.status).toBe(409);
        expect(response.body.error.code).toBe("EMAIL_ALREADY_EXISTS");
    });

    it("recusa senha curta e diz qual campo falhou", async () => {
        const response = await request(app)
            .post("/register")
            .send({ ...validUser, password: "123" });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(response.body.error.details).toHaveProperty("password");
    });
});

describe("POST /login", () => {

    it("autentica e devolve accessToken + cookie httpOnly", async () => {
        await request(app).post("/register").send(validUser);

        const response = await request(app)
            .post("/login")
            .send({ username: validUser.username, password: validUser.password });

        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).toBeTruthy();
        expect(response.body.data).not.toHaveProperty("refreshToken");

        const cookies = response.headers["set-cookie"] as unknown as string[];
        expect(cookies.join()).toContain("refreshToken=");
        expect(cookies.join()).toContain("HttpOnly");
    });

    it("recusa senha errada", async () => {
        await request(app).post("/register").send(validUser);

        const response = await request(app)
            .post("/login")
            .send({ username: validUser.username, password: "senhaerrada123" });

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
    });
});

describe("GET /users/count", () => {

    it("retorna zero quando não há usuários", async () => {
        const response = await request(app).get("/users/count");

        expect(response.status).toBe(200);
        expect(response.body.data.total).toBe(0);
    });

    it("conta os usuários cadastrados", async () => {
        await request(app).post("/register").send(validUser);

        const response = await request(app).get("/users/count");

        expect(response.body.data.total).toBe(1);
    });
});