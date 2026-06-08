import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AUTH_API } from '../constants/api.constants';
import { AuthService } from '../services/auth.service';

const AUTH_SKIP_URLS = [
  AUTH_API.login,
  AUTH_API.register,
  AUTH_API.refresh,
  AUTH_API.passwordReset,
  AUTH_API.passwordResetConfirm,
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const shouldSkip = AUTH_SKIP_URLS.some((url) => req.url.startsWith(url));
  const accessToken = authService.getAccessToken();

  const authReq =
    !shouldSkip && accessToken
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefreshRequest = req.url.startsWith(AUTH_API.refresh);
      if (error.status !== 401 || shouldSkip || isRefreshRequest) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap(() => {
          const newToken = authService.getAccessToken();
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
          });
          return next(retryReq);
        }),
        catchError(() => {
          authService.logout();
          return throwError(() => error);
        })
      );
    })
  );
};
