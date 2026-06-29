export interface AuthResult {
    userId: string;
    email: string;
    displayName?: string | null;
    accessToken: string;
}
