import {Response} from "express";
import { success } from "zod";

export function ok<T>(res: Response, data: T, statusCode: number = 200): Response {
    return res.status(statusCode).json({ 
        success: true,
        data
     });
}