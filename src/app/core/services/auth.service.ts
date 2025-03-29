import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/';
  token = signal<string | null>(null);
  refreshToken = signal<string | null>(null);
  isAuthenticated = signal<boolean>(false);
  user = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage() {
    const token = localStorage.getItem('token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (token && refresh_token) {
      this.token.set(token);
      this.refreshToken.set(refresh_token);
      this.isAuthenticated.set(true);
      this.decodeToken(token);
    }
  }

  private decodeToken(token: string) {
    try {
      const decodedUser: User = jwtDecode(token);
      this.user.set(decodedUser);
      console.log(decodedUser)
    } catch (error) {
      console.error('Invalid token', error);
      this.logout();
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, userData);
  }

  login( email: string, password: string ): Observable<any> {
    return this.http.post<{ access: string, refresh: any }>(`${this.apiUrl}login/`, { email, password }).pipe(
      tap((res) => {
        this.token.set(res.access);
        this.refreshToken.set(res.refresh);

        this.user.set(this.getUser());
        this.isAuthenticated.set(true);
        localStorage.setItem('token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.user.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUser(): User | null {
    return this.user();
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.http.post<{ access: string }>(`${this.apiUrl}token/refresh/`, { refresh: this.refreshToken() }).pipe(
      tap((res) => {
        this.token.set(res.access);
        localStorage.setItem('token', res.access);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

}
