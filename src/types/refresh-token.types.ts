export interface RefreshToken {
    id: number;
    user_id: number;
    token_hash: string;
    expires_at: string;
    created_at: string;
    revoked_at: string | null;
}