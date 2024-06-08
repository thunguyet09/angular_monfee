import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/User';
import { API } from '../api/api.service';
import { TokenResetPasswordService } from './token_reset_password.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private tokenResetPasswordService: TokenResetPasswordService,
    private api: API){}
  tokenIsExpired(): Observable<boolean> {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (typeof user === 'object') {
        return of(false);
      } else {
        return this.tokenResetPasswordService.isAccessTokenExpired(user.access_token);
      }
    } else {
      return of(false);
    }
  }

  public async handleExpiredToken(): Promise<string | null> {
    try {
      let newAccessToken: string | null = null;
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (typeof user === 'object') {
          const refreshToken = user.refresh_token;
          const newAccessTokenResponse = await this.api.refreshToken(refreshToken).toPromise();
          const accessTokenString = newAccessTokenResponse as string;
          const userLocalStorage = {
            access_token: accessTokenString,
            refresh_token: refreshToken,
            role: user.role,
            user_id: user.user_id,
          };
          this.tokenResetPasswordService.setToken(accessTokenString);
          newAccessToken = accessTokenString;
          localStorage.setItem('user', JSON.stringify(userLocalStorage));
        }
      }
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}
