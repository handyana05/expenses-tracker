import { Service } from '@angular/core';

@Service()
export class TokenStorage {
    private readonly tokenKey = 'expense_tracker_access_token';

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }
}
