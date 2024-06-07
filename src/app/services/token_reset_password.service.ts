
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, of, switchMap } from "rxjs";
import { SaveIdService } from "./saveId.service";
import { API } from "../api/api.service";
import { Router } from "@angular/router";
import { JwtHelperService } from "./jwtHelper.service";

@Injectable({
  providedIn: 'root'
})
export class TokenResetPasswordService{
  constructor(private saveIdService: SaveIdService, private api: API,
    private router: Router, private jwtHelper: JwtHelperService){}
  token = new BehaviorSubject<string>('');
  setToken(val:string){
    this.token.next(val)
  }

  getToken():Observable<string>{
    return this.token.asObservable();
  }

  refreshToken = new BehaviorSubject<string>('');
  setRefreshToken(val:string){
    this.refreshToken.next(val)
  }

  getRefreshToken():Observable<string>{
    return this.refreshToken.asObservable();
  }

  public isAccessTokenExpired(accessToken: string): Observable<boolean> {
    const decodedToken = this.jwtHelper.decodeToken(accessToken);
    if (!decodedToken || !decodedToken.exp) {
      return of(true);
    }

    const currentTime = new Date().getTime() / 1000;
    return of(decodedToken.exp < currentTime);
  }

  public async handleExpiredToken() {
    try {
      const userString = localStorage.getItem('user');
      if(userString){
        const user = JSON.parse(userString);
        if (typeof user === 'object') {
          const refreshToken = user.refresh_token
          console.log(refreshToken)
          this.api.refreshToken(refreshToken).subscribe((newAccessToken) => {
            console.log(newAccessToken)
            const accessTokenString = newAccessToken as string;
            const userLocalStorage = {
              'access_token': newAccessToken,
              'refresh_token': refreshToken,
              'role': user.role,
              'user_id': user.user_id
            }
            this.setToken(accessTokenString)
            localStorage.setItem('user', JSON.stringify(userLocalStorage));
          })
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

}
