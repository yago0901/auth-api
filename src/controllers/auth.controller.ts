import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { sendSuccess  } from "../utils/http-response.js";
import { AuthenticatedRequest } from "../types/authenticated-request.js";

export class AuthController {

    private authService = new AuthService();

    usersCount = async (req: Request, res: Response) => {
        const result = await this.authService.getUsersCount();

        return sendSuccess(res, result);;
    };

    registerUser = async (req: Request, res: Response) => {
        const { first_name, last_name, username, gender, email, password } = req.body;

        const user = await this.authService.registerUser({ first_name, last_name, username, gender, email, password });

        return sendSuccess(res, user, 201);
    };

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const result = await this.authService.login(username, password);

        return sendSuccess(res, result);;
    };

    refresh = async (req: Request, res: Response) => {

        const { refreshToken } = req.body;

        const result = await this.authService.refresh(refreshToken);

        return sendSuccess(res, result);
    };

    profile = async (req: AuthenticatedRequest, res: Response) => {
        const result = await this.authService.getProfile(req.userId);
        return sendSuccess(res, result);
    };

    logout = async (req: Request, res: Response) => {

        const { refreshToken } = req.body;

        await this.authService.logout(
            refreshToken
        );

        return sendSuccess(res, { message: "Logout successful" });
    };

}