import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { AppError } from "../errors/app-errors.js";
import { ok } from "../utils/http-response.js";

export class AuthController {

    private authService = new AuthService();

    usersCount = async (req: Request, res: Response) => {
        const result = await this.authService.getUsersCount();

        return ok(res, result);;
    };

    registerUser = async (req: Request, res: Response) => {
        const { first_name, last_name, username, gender, email, password } = req.body;

        const user = await this.authService.registerUser({ first_name, last_name, username, gender, email, password });

        return ok(res, user, 201);;
    };

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const result = await this.authService.login(username, password);

        return ok(res, result);;
    };

    refresh = async (req: Request, res: Response) => {

        const { refreshToken} = req.body;

        const result = await this.authService.refresh( refreshToken);

        return ok(res, result);
    };

    profile = async (req: Request, res: Response) => {
        const userId = req.userId;

        if (!userId) {
            throw new AppError(
                "User ID was not found",
                401,
                "USER_ID_NOT_FOUND"
            );
        }

        const result = await this.authService.getProfile(userId);

        return ok(res, result);
    };

    logout = async (req: Request, res: Response) => {

        const { refreshToken } = req.body;

        await this.authService.logout(
            refreshToken
        );

        return ok(res, { message: "Logout successful" });
    };

}