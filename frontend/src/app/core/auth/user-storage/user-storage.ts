import { Service } from '@angular/core';
import { AuthenticatedUser } from '../../models/authenticated-user.model';

@Service()
export class UserStorage {
  private readonly userKey = 'expense_tracker_user';

  setUser(user: AuthenticatedUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): AuthenticatedUser | null {
    const storedUser = localStorage.getItem(this.userKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthenticatedUser;
    } catch {
      this.removeUser();
      return null;
    }
  }

  removeUser(): void {
    localStorage.removeItem(this.userKey);
  }
}
