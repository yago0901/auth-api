import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/user.repository.js";
import { CreateUserData } from "../types/user.types.js";
import { AppError } from "../errors/app-errors.js";

export class AuthService {

    private userRepository = new UserRepository();

    async getUsersCount() {
        const total = await this.userRepository.countUsers();

        return {
            total,
        };
    }

    async registerUser({ first_name, last_name, username, gender, email, password }: CreateUserData) {
        const existingEmail = await this.userRepository.findUserByEmail(email);
        const existingUsername = await this.userRepository.findUserByUsername(username);

        if (existingUsername) {
            throw new AppError(
                "User already exists",
                409,
                "USER_ALREADY_EXISTS"
            );
        }
        if (existingEmail) {
            throw new AppError(
                "Email already exists",
                409,
                "USERNAME_ALREADY_EXISTS"
            );
        }


        const password_hash = await bcrypt.hash(password, 12);
        const user = await this.userRepository.createUser({ first_name, last_name, username, gender, email, password_hash });

        return {
            id: user!.id,
            first_name: user!.first_name,
            last_name: user.last_name,
            username: user.username,
            gender: user.gender,
            email: user!.email,
            created_at: user!.created_at
        };
    }
};