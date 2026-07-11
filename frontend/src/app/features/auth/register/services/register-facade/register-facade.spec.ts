import { TestBed } from '@angular/core/testing';

import { RegisterFacade } from './register-facade';
import { Auth } from '../../../../../core/auth/auth/auth';
import { Router } from '@angular/router';
import { RegisterCommand } from '../../models/register.model';
import { firstValueFrom, of, throwError } from 'rxjs';

describe('RegisterFacade', () => {
  let facade: RegisterFacade;

  const authMock = {
    register: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        RegisterFacade,
        {
          provide: Auth,
          useValue: authMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });

    facade = TestBed.inject(RegisterFacade);
  });

  it('should register and navigate to dashboard', async () => {
    const command: RegisterCommand = {
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    };

    authMock.register.mockReturnValue(
      of({
        userId: 'user-id',
        email: command.email,
        displayName: command.displayName,
        accessToken: 'token',
      })
    );

    await firstValueFrom(facade.register(command));

    expect(authMock.register).toHaveBeenCalledWith({
      displayName: command.displayName,
      email: command.email,
      password: command.password,
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should set error when registration fails', async () => {
    const command: RegisterCommand = {
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    };

    authMock.register.mockReturnValue(
      throwError(() => new Error('Conflict'))
    );

    await expect(
      firstValueFrom(facade.register(command))
    ).rejects.toThrow('Conflict');

    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBe('Could not create account.');
  });
});
