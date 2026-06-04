import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

const CURRENT_USER_STORAGE_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<User | null>(this.loadCurrentUser());

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private loadCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
    } catch {
      // Ignore invalid stored user data
    }
    return null;
  }
}
