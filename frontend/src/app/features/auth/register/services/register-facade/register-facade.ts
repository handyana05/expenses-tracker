import { inject, Service, signal } from '@angular/core';
import { Auth } from '../../../../../core/auth/auth/auth';
import { Router } from '@angular/router';
import { RegisterCommand } from '../../models/register.model';
import { RegisterRequest } from '../../../../../core/models/register-request.model';
import { finalize, tap } from 'rxjs';

@Service()
export class RegisterFacade {
    private readonly auth = inject(Auth);
    private readonly router = inject(Router);

    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    register(command: RegisterCommand) {
        const request: RegisterRequest = {
        displayName: command.displayName,
        email: command.email,
        password: command.password,
        };

        this.loading.set(true);
        this.error.set(null);

        return this.auth.register(request).pipe(
            tap({
                next: () => {
                void this.router.navigate(['/dashboard']);
                },
                error: () => {
                this.error.set('Could not create account.');
                },
            }),
            finalize(() => {
                this.loading.set(false);
            })
        );
    }
}
