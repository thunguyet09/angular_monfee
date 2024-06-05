import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SaveIdService } from '../services/saveId.service';
import { TokenResetPasswordService } from '../services/token_reset_password.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenResetPasswordService: TokenResetPasswordService) {}

  public token:string = ''
  ngOnInit(){
    this.tokenResetPasswordService.getToken().subscribe((token) => {
      this.token = token;
    })
  }
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Add access token to request header
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.tokenResetPasswordService.removeToken();
        }
        return throwError(error);
      })
    );
  }
}
