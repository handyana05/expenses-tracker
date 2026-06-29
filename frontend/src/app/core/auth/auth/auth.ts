import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { LoginRequest } from '../../models/login-request.model';
import { AuthResult } from '../../models/auth-result.model';
import { tap } from 'rxjs';
import { API_URL } from '../../config/api.config';
import { RegisterRequest } from '../../models/register-request.model';
import { AuthState } from '../auth-state/auth-state';

@Service()
export class Auth {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = inject(API_URL);
    private readonly authState = inject(AuthState);

    login(request: LoginRequest) {
        return this.http
            .post<AuthResult>(`${this.apiUrl}/auth/login`, request)
            .pipe(tap((result) => this.authState.setAuthenticated(result.accessToken)));
    }

    register(request: RegisterRequest) {
        return this.http
            .post<AuthResult>(`${this.apiUrl}/auth/register`, request)
            .pipe(tap((result) => this.authState.setAuthenticated(result.accessToken)));
    }

    logout(): void {
        this.authState.clear();
    }

    isAuthenticated(): boolean {
        return this.authState.isAuthenticated();
    }
}
