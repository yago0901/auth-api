export interface CreateUserData {
    first_name: string;
    last_name: string;
    username: string;
    gender: string;
    email: string;
    password: string;
}

export interface CreateUserDatabaseData {
    first_name: string;
    last_name: string;
    username: string;
    gender: string;
    email: string;
    password_hash: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    gender: string
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface LoginData {
    username: string;
    password: string;
}
