
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenResetPasswordService{
  constructor(){}
  token = new BehaviorSubject<string>('');
  setToken(val:string){
    this.token.next(val)
  }

  getToken():Observable<string>{
    return this.token.asObservable();
  }
}
