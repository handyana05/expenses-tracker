import { TestBed } from '@angular/core/testing';
import { UserStorage } from './user-storage';

describe('UserStorage', () => {
  let service: UserStorage;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [UserStorage] });
    service = TestBed.inject(UserStorage);
  });

  afterEach(() => localStorage.clear());

  it('should store and remove the authenticated user', () => {
    const user = { email: 'jane@example.com', displayName: 'Jane Doe' };

    service.setUser(user);
    expect(service.getUser()).toEqual(user);

    service.removeUser();
    expect(service.getUser()).toBeNull();
  });

  it('should discard invalid stored user data', () => {
    localStorage.setItem('expense_tracker_user', 'invalid-json');

    expect(service.getUser()).toBeNull();
  });
});
