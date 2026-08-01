export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

export interface CreateUserDatabaseData {
    name: string;
    email: string;
    password_hash: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
}
