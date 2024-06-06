
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
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

  public isAccessTokenExpired(accessToken: string): Observable<boolean> {
    const decodedToken = this.jwtHelper.decodeToken(accessToken);
    if (!decodedToken || !decodedToken.exp) {
      return of(true);
    }

    const currentTime = new Date().getTime() / 1000;
    return of(decodedToken.exp < currentTime);
  }

}
