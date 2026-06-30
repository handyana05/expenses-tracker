import { TestBed } from '@angular/core/testing';

import { LoginFacade } from './login-facade';
import { LoginCommand } from '../login.model';
import { Auth } from '../../../../core/auth/auth/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginFacade', () => {
  let facade: LoginFacade;

  const authMock = {
    login: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(() => {
    authMock.login.mockReset();
    routerMock.navigate.mockReset();

    TestBed.configureTestingModule({
      providers: [
        LoginFacade,
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

    facade = TestBed.inject(LoginFacade);
  });

  it('should login and navigate to dashboard', () => {
    const command: LoginCommand = {
      email: 'user@example.com',
      password: 'Password123!',
    };

    authMock.login.mockReturnValue(
      of({
        userId: 'user-id',
        email: command.email,
        displayName: 'User',
        accessToken: 'token',
      })
    );

    facade.login(command);

    expect(authMock.login).toHaveBeenCalledWith({
      email: command.email,
      password: command.password,
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should show error when login fails', () => {
    const command: LoginCommand = {
      email: 'user@example.com',
      password: 'WrongPassword',
    };

    authMock.login.mockReturnValue(
      throwError(() => new Error('Unauthorized'))
    );

    facade.login(command);

    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBe('Invalid email or password.');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
