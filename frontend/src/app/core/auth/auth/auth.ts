import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { LoginRequest } from '../../models/login-request.model';
import { AuthResult } from '../../models/auth-result.model';
import { tap } from 'rxjs';
import { API_URL } from '../../config/api.config';
import { RegisterRequest } from '../../models/register-request.model';
import { AuthState } from '../auth-state/auth-state';
import { ApiRoutes } from '../../api/api-routes';

@Service()
export class Auth {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = inject(API_URL);
    private readonly authState = inject(AuthState);

    login(request: LoginRequest) {
        return this.http
            .post<AuthResult>(`${this.apiUrl}${ApiRoutes.auth.login}`, request)
            .pipe(tap((result) => this.setAuthenticated(result)));
    }

    register(request: RegisterRequest) {
        return this.http
            .post<AuthResult>(`${this.apiUrl}${ApiRoutes.auth.register}`, request)
            .pipe(tap((result) => this.setAuthenticated(result)));
    }

    logout(): void {
        this.authState.clear();
    }

    isAuthenticated(): boolean {
        return this.authState.isAuthenticated();
    }

    private setAuthenticated(result: AuthResult): void {
        this.authState.setAuthenticated(result.accessToken, {
            email: result.email,
            displayName: result.displayName ?? null,
        });
    }
}
