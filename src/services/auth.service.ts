import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/user.repository.js";
import { CreateUserData, CreateUserDatabaseData } from "../types/user.types.js";

export class AuthService {

    private userRepository = new UserRepository();

    async getUsersCount() {
        const total = await this.userRepository.countUsers();

        return {
            total,
        };
    }

    async registerUser({ name, email, password }: CreateUserData) {
        const existingUser = await this.userRepository.findUserByEmail(email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const password_hash = await bcrypt.hash(password, 12);
        const user = await this.userRepository.createUser({ name, email, password_hash });

        return {
            id: user!.id,
            name: user!.name,
            email: user!.email,
            created_at: user!.created_at
        };
    }
};