import { computed, inject, Service, signal } from '@angular/core';
import { TokenStorage } from '../token-storage/token-storage';

@Service()
export class AuthState {
    private readonly tokenStorage = inject(TokenStorage);
    private readonly token = signal<string | null>(
        this.tokenStorage.getToken()
    );
    readonly accessToken = this.token.asReadonly();
    readonly isAuthenticated = computed(() => !!this.token());

    setAuthenticated(token: string): void {
        this.tokenStorage.setToken(token);
        this.token.set(token);
    }

    clear(): void {
        this.tokenStorage.removeToken();
        this.token.set(null);
    }
}
