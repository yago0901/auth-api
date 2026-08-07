import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/user.repository.js";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.js";
import { CreateUserData } from "../types/user.types.js";
import { AppError } from "../errors/app-errors.js";
import { TokenService } from "./token.service.js";
import { toUserResponseDTO } from "../dto/user-response.dto.js";

export class AuthService {

    private userRepository = new UserRepository();
    private tokenService = new TokenService();
    private refreshTokenRepository = new RefreshTokenRepository();

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

        return toUserResponseDTO(user!);
    }

    async login(username: string, password: string) {
        const user = await this.userRepository.findUserByUsername(username);
        const isPasswordValid = user ? await bcrypt.compare(password, user.password_hash) : false;

        if (!user || !isPasswordValid) {
            throw new AppError(
                "Invalid username or password",
                401,
                "INVALID_CREDENTIALS"
            );
        }

        const accessToken = this.tokenService
            .generateAccessToken(user.id);

        const refreshToken = this.tokenService
            .generateRefreshToken();

        const refreshTokenHash = this.tokenService
            .hashRefreshToken(refreshToken);

        const expiresAt = this.tokenService
            .getRefreshTokenExpirationDate();

        await this.refreshTokenRepository.create({
            user_id: user.id,
            token_hash: refreshTokenHash,
            expires_at: expiresAt.toISOString(),
        });

        return {
            user: toUserResponseDTO(user),
            accessToken,
            refreshToken,
        };

    }

    async getProfile(userId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new AppError(
                "User not found",
                404,
                "USER_NOT_FOUND"
            );
        }
        return {
            user: toUserResponseDTO(user),
        };
    }

    async refresh(refreshToken: string) {

        const refreshTokenHash = this.tokenService.hashRefreshToken(refreshToken);
        const storedToken = await this.refreshTokenRepository.findByHash(refreshTokenHash);

        if (!storedToken) {
            throw new AppError(
                "Invalid refresh token",
                401,
                "INVALID_REFRESH_TOKEN"
            );
        }

        if (storedToken.revoked_at) {
            throw new AppError(
                "Refresh token revoked",
                401,
                "REFRESH_TOKEN_REVOKED"
            );
        }

        if (
            new Date(storedToken.expires_at) < new Date()
        ) {
            throw new AppError(
                "Refresh token expired",
                401,
                "REFRESH_TOKEN_EXPIRED"
            );
        }

        await this.refreshTokenRepository.revoke(
            storedToken.id
        );

        const newRefreshToken = this.tokenService.generateRefreshToken();


        const newRefreshTokenHash = this.tokenService.hashRefreshToken(newRefreshToken);


        const expiresAt = this.tokenService
            .getRefreshTokenExpirationDate();


        await this.refreshTokenRepository.create({
            user_id: storedToken.user_id,
            token_hash: newRefreshTokenHash,
            expires_at: expiresAt.toISOString(),
        });

        const accessToken =
            this.tokenService.generateAccessToken(
                storedToken.user_id
            );


        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(refreshToken: string) {

        const refreshTokenHash = this.tokenService.hashRefreshToken(refreshToken);
        const storedToken = await this.refreshTokenRepository.findByHash(refreshTokenHash);

        if (!storedToken) {
            throw new AppError(
                "Invalid refresh token",
                401,
                "INVALID_REFRESH_TOKEN"
            );
        }

        if (storedToken.revoked_at) {
            return;
        }

        await this.refreshTokenRepository.revoke(
            storedToken.id
        );
    }
};