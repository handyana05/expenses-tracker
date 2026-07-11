import { inject, Service, signal } from '@angular/core';
import { Auth } from '../../../../../core/auth/auth/auth';
import { Router } from '@angular/router';
import { LoginCommand } from '../../models/login.model';
import { LoginRequest } from '../../../../../core/models/login-request.model';
import { AppRoutes } from '../../../../../shared/constants/app-routes';

@Service()
export class LoginFacade {
    private readonly auth =  inject(Auth);
    private readonly router = inject(Router);

    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    login(cmd: LoginCommand): void {
        const request: LoginRequest = {
            email: cmd.email,
            password: cmd.password
        } satisfies LoginRequest;

        this.loading.set(true);
        this.error.set(null);

        this.auth.login(request).subscribe({
            next: async () => {
                await this.router.navigate([AppRoutes.dashboard]);
            },
            error: () => {
                this.error.set('Invalid email or password.');
                this.loading.set(false);
            },
            complete: () => {
                this.loading.set(false);
            },
        })
    }
}
