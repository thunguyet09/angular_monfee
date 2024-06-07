import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs'; // Import 'of' here
import { catchError, switchMap } from 'rxjs/operators';
import { TokenResetPasswordService } from '../services/token_reset_password.service';
import { API } from '../api/api.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenResetPasswordService: TokenResetPasswordService,
    private api: API) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const userString = localStorage.getItem('user');
      if (!userString) {
          return next.handle(request);
      }

      const user = JSON.parse(userString);

      if (typeof user !== 'object') {
          return next.handle(request);
      }

      const accessToken = user.access_token;
      this.tokenResetPasswordService.isAccessTokenExpired(accessToken).subscribe((isExpired) => {
        if (isExpired) {
          return this.api.refreshToken(user.refresh_token).subscribe((newAccessToken) => {
            const userLocalStorage = {
                'access_token': newAccessToken,
                'refresh_token': user.refresh_token,
                'role': user.role,
                'user_id': user.user_id
            };
            localStorage.setItem('user', JSON.stringify(userLocalStorage));
            const authReq = request.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` },
            });
            return next.handle(authReq);
          });
        } else {
            const authReq = request.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` },
            });
            return next.handle(authReq);
        }
      })
      catchError((error) => {
          console.error('Error checking token expiration:', error);
          return throwError(error);
      })

      return next.handle(request)
    }
}
