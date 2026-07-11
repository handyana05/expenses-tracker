import { computed, inject, Service, signal } from '@angular/core';
import { TokenStorage } from '../token-storage/token-storage';
import { UserStorage } from '../user-storage/user-storage';
import { AuthenticatedUser } from '../../models/authenticated-user.model';

@Service()
export class AuthState {
    private readonly tokenStorage = inject(TokenStorage);
    private readonly userStorage = inject(UserStorage);
    private readonly token = signal<string | null>(
        this.tokenStorage.getToken()
    );
    readonly accessToken = this.token.asReadonly();
    private readonly authenticatedUser = signal<AuthenticatedUser | null>(
        this.userStorage.getUser()
    );
    readonly user = this.authenticatedUser.asReadonly();
    readonly isAuthenticated = computed(() => !!this.token());
    readonly userLabel = computed(() =>
        this.authenticatedUser()?.displayName?.trim() ||
        this.authenticatedUser()?.email ||
        'User'
    );
    readonly userInitials = computed(() => {
        const user = this.authenticatedUser();
        const source = user?.displayName?.trim() || user?.email.split('@')[0] || 'U';
        const parts = source.split(/[\s._-]+/).filter(Boolean);

        if (parts.length > 1) {
            return `${parts[0][0]}${parts.at(-1)?.[0]}`.toUpperCase();
        }

        return source.slice(0, 2).toUpperCase();
    });

    setAuthenticated(token: string, user?: AuthenticatedUser): void {
        this.tokenStorage.setToken(token);
        this.token.set(token);

        if (user) {
            this.userStorage.setUser(user);
            this.authenticatedUser.set(user);
        }
    }

    clear(): void {
        this.tokenStorage.removeToken();
        this.userStorage.removeUser();
        this.token.set(null);
        this.authenticatedUser.set(null);
    }
}
