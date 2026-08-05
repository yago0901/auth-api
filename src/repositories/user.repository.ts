import database from "../database/knex.js";
import { CreateUserDatabaseData, User } from "../types/user.types.js";

export class UserRepository {
    async countUsers() {
        const result = await database("users").count({
            total: "*",
        });

        return Number(result[0].total);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user = await database<User>("users")
            .where({ email })
            .first();

        return user ?? null;
    }

    async findUserByUsername(
        username: string
    ): Promise<User | null> {
        const user = await database<User>(
            "users"
        )
            .where({ username })
            .first();

        return user ?? null;
    }

    async findUserById( id: number ): Promise<User | null> {
        const user =
            await database<User>(
                "users"
            )
                .where({ id })
                .first();

        return user || null;
    }

    async createUser(
        userData: CreateUserDatabaseData
    ): Promise<User> {
        const [user] = await database<User>(
            "users"
        )
            .insert(userData)
            .returning("*");

        return user;
    }
}