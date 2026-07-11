import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { provideRouter } from '@angular/router';
import { RegisterFacade } from './services/register-facade/register-facade';
import { of, throwError } from 'rxjs';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;
  let component: Register;

  const facadeMock = {
    loading: vi.fn(() => false),
    error: vi.fn(() => null),
    register: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    })
      .overrideComponent(Register, {
        set: {
          providers: [
            {
              provide: RegisterFacade,
              useValue: facadeMock,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not register when form is invalid', () => {
    component.form.setValue({
      displayName: '',
      email: '',
      password: '',
    });

    component.submit();

    expect(facadeMock.register).not.toHaveBeenCalled();
    expect(component.form.touched).toBe(true);
  });

  it('should register when form is valid', () => {
    facadeMock.register.mockReturnValue(of({}));

    component.form.setValue({
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    component.submit();

    expect(facadeMock.register).toHaveBeenCalledWith({
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });
  });

  it('should not register while already loading', () => {
    facadeMock.loading.mockReturnValue(true);

    component.form.setValue({
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    component.submit();

    expect(facadeMock.register).not.toHaveBeenCalled();
  });

  it('should handle registration error without throwing an unhandled error', () => {
    facadeMock.register.mockReturnValue(
      throwError(() => new Error('Registration failed'))
    );

    component.form.setValue({
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(() => component.submit()).not.toThrow();
  });
});
