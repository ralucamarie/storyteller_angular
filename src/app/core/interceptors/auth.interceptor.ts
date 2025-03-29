import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  let clonedRequest: HttpRequest<any> = req;

  if (token) {
    clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }


  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.refreshToken()) {
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newToken = authService.token();
            return next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              })
            );
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );};
