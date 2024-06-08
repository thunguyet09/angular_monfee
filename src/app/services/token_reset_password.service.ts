
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { JwtHelperService } from "./jwtHelper.service";

@Injectable({
  providedIn: 'root'
})
export class TokenResetPasswordService{
  constructor(private jwtHelper: JwtHelperService){}
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

}
