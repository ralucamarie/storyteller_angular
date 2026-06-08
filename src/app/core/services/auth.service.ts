import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';
import { AUTH_API, TOKEN_STORAGE_KEYS } from '../constants/api.constants';
import {
  ApiMessageResponse,
  AuthResponse,
  AuthTokens,
  LoginRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  RegisterRequest,
} from '../models/auth.model';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<IUser | null>(null);

  login(credentials: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(AUTH_API.login, credentials).pipe(
      tap((tokens) => this.storeTokens(tokens))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_API.register, payload).pipe(
      tap((response) => {
        this.storeTokens(response);
        if (response.user) {
          this.currentUser.set(response.user);
        }
      })
    );
  }

  requestPasswordReset(payload: PasswordResetRequest): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(AUTH_API.passwordReset, payload);
  }

  confirmPasswordReset(payload: PasswordResetConfirmRequest): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(AUTH_API.passwordResetConfirm, payload);
  }

  loadProfile(): Observable<IUser> {
    return this.http.get<IUser>(AUTH_API.profile).pipe(
      tap((user) => this.currentUser.set(user))
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<AuthTokens>(AUTH_API.refresh, { refresh })
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.access);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.refresh);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEYS.access);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEYS.refresh);
  }

  initSession(): void {
    if (this.isAuthenticated() && !this.currentUser()) {
      this.loadProfile().subscribe({ error: () => this.logout() });
    }
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_STORAGE_KEYS.access, tokens.access);
    localStorage.setItem(TOKEN_STORAGE_KEYS.refresh, tokens.refresh);
  }
}
