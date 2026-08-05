import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {

    private authService = new AuthService();

    usersCount = async (req: Request, res: Response) => {
        const result = await this.authService.getUsersCount();

        return res.json(result);
    };

    registerUser = async (req: Request, res: Response) => {
        const { first_name, last_name, username, gender, email, password } = req.body;

        const user = await this.authService.registerUser({ first_name, last_name, username, gender, email, password });

        return res.status(201).json(user);
    };

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const result = await this.authService.login(username, password);

        return res.status(200).json(result);
    };

    profile = async (req: Request, res: Response) => {
        const userId = req.userId;

        if (!userId) {
            throw new Error(
                "User ID was not found"
            );
        }

        const result = await this.authService.getProfile(userId);

        return res.status(200).json(
            result
        );
    };
}