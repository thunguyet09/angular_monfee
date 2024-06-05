
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SaveIdService } from "./saveId.service";
import { API } from "../api/api.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TokenResetPasswordService{
  constructor(private saveIdService: SaveIdService, private api: API,
    private router: Router){}
  token = new BehaviorSubject<string>('');
  setToken(val:string){
    this.token.next(val)
  }

  getToken():Observable<string>{
    return this.token.asObservable();
  }

  removeToken(){
    this.saveIdService.getUserId().subscribe((userId) => {
      this.api.removeToken(userId).subscribe((res:any) => {
        this.router.navigate(['/'])
      })
    })
  }
}
