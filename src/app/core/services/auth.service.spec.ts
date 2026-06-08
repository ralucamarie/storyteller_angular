import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { AUTH_API, TOKEN_STORAGE_KEYS } from '../constants/api.constants';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
    routerSpy.navigate.calls.reset();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('logs in and stores the tokens', () => {
    service.login({ email: 'a@b.com', password: 'secret' } as any).subscribe();

    const req = httpMock.expectOne(AUTH_API.login);
    expect(req.request.method).toBe('POST');
    req.flush({ access: 'access-token', refresh: 'refresh-token' });

    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.access)).toBe('access-token');
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.refresh)).toBe('refresh-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('registers, stores tokens and sets the current user', () => {
    const user = { id: 1, email: 'a@b.com', author_name: 'ana' };
    service.register({} as any).subscribe();

    const req = httpMock.expectOne(AUTH_API.register);
    expect(req.request.method).toBe('POST');
    req.flush({ access: 'a', refresh: 'r', user });

    expect(service.currentUser()).toEqual(user as any);
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.access)).toBe('a');
  });

  it('clears tokens and navigates to login on logout', () => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.access, 'a');
    localStorage.setItem(TOKEN_STORAGE_KEYS.refresh, 'r');

    service.logout();

    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.access)).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('refreshToken errors when no refresh token is stored', (done) => {
    service.refreshToken().subscribe({
      next: () => done.fail('expected an error'),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
    httpMock.expectNone(AUTH_API.refresh);
  });

  it('isAuthenticated reflects the presence of an access token', () => {
    expect(service.isAuthenticated()).toBeFalse();
    localStorage.setItem(TOKEN_STORAGE_KEYS.access, 'token');
    expect(service.isAuthenticated()).toBeTrue();
  });
});
