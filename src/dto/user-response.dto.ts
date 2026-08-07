import { User } from "../types/user.types.js";

export interface UserResponseDTO {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    gender: string;
    email: string;
    created_at: string;
}

export function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        gender: user.gender,
        email: user.email,
        created_at: user.created_at,
    };
}