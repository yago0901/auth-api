import { NextFunction, Request, Response, } from "express";

import { ZodType, } from "zod";

export function validate(schema: ZodType) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: result.error.flatten().fieldErrors,
            });
        }

        req.body = result.data;

        return next();
    };
}