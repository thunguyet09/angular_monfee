import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'; // Import 'of' here
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { TokenResetPasswordService } from '../services/token_reset_password.service';
import { API } from '../api/api.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService,
    private api: API,
    private router: Router) { }

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
    this.tokenService.tokenIsExpired().subscribe(async (isExpired) => {
      if (isExpired) {
        const newAccessToken = await this.tokenService.handleExpiredToken()
        const userLocalStorage = {
          'access_token': newAccessToken,
          'refresh_token': user.refresh_token,
          'role': user.role,
          'user_id': user.user_id
        };
        localStorage.setItem('user', JSON.stringify(userLocalStorage));
        if (newAccessToken) {
          localStorage.setItem('jwt', newAccessToken)
        }
        return next.handle(request.clone({
          setHeaders: {
            Authorization: `Bearer ${newAccessToken}`
          }
        }));

      } else {
        localStorage.setItem('jwt', accessToken)
        return next.handle(request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`
          }
        }));
      }
    })
    catchError((error) => {
      if (error.status === 401) {
        this.router.navigate(['/login'])
      } else {
        console.error('Error in interceptor:', error);
      }
      return throwError(error);
    })

    return next.handle(request)
  }
}
