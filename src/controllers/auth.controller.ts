import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {

    private authService = new AuthService();

    home = (req: Request, res: Response) => {

        const result = this.authService.getApiInfo();

        return res.json(result);

    }

    health =(req: Request, res: Response) => {

        const result = this.authService.getHealth();

        return res.json(result);
    }

    version = (req: Request, res: Response) => {

        const result = this.authService.getVersion();

        return res.json(result);
    }

    about = (req: Request, res: Response) => {

        const result = this.authService.getAbout();

        return res.json(result);
    }

    ping = (req: Request, res: Response) => {

        const result = this.authService.getPing();

        return res.json(result);
    }

    time = (req: Request, res: Response) => {

        const result = this.authService.getTime();

        return res.json(result);
    }
};