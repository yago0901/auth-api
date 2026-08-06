import database from "../database/knex.js";
import { RefreshToken } from "../types/refresh-token.types.js";

export class RefreshTokenRepository {
    
    async create(token: Omit<RefreshToken, "id" | "created_at" | "revoked_at">): Promise<RefreshToken> {

        const [refreshToken] = await
            database<RefreshToken>("refresh_tokens")
                .insert(token)
                .returning("*");

        return refreshToken;
    }

    async findByHash(tokenHash: string): Promise<RefreshToken | null> {

        const token =
            await database<RefreshToken>(
                "refresh_tokens"
            )
                .where({
                    token_hash: tokenHash,
                })
                .first();

        return token || null;
    }

    async revoke(id: number): Promise<void> {

        await database(
            "refresh_tokens"
        )
            .where({ id })
            .update({
                revoked_at:
                    database.fn.now(),
            });
    }

    async findActiveByUserId(userId: number): Promise<RefreshToken[]> {

        return database<RefreshToken>("refresh_tokens")
            .where({
                user_id: userId,
            })
            .whereNull(
                "revoked_at"
            );
    }

}