import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/http-response.js";
import { AuthenticatedRequest } from "../types/authenticated-request.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookie.js";
import { AppError } from "../errors/app-errors.js";

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

        setRefreshTokenCookie(res, result.refreshToken);

        return sendSuccess(res, { user: result.user, accessToken: result.accessToken });
    };

    refresh = async (req: Request, res: Response) => {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new AppError(
                "Refresh token is required",
                401,
                "REFRESH_TOKEN_REQUIRED"
            );
        }

        const result = await this.authService.refresh(refreshToken);

        setRefreshTokenCookie(res, result.refreshToken);

        return sendSuccess(res, { accessToken: result.accessToken });
    };

    profile = async (req: Request, res: Response) => {
        const { userId } = req as AuthenticatedRequest;

        const result = await this.authService.getProfile(userId);
        return sendSuccess(res, result);
    };

    logout = async (req: Request, res: Response) => {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new AppError(
                "Refresh token is required",
                401,
                "REFRESH_TOKEN_REQUIRED"
            );
        }

        await this.authService.logout(refreshToken);

        clearRefreshTokenCookie(res);

        return sendSuccess(res, { message: "Logout successful" });
    };

}