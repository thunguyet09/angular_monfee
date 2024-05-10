import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MiniCart{
  minicart = new BehaviorSubject<boolean>(false);

  setMiniCart(minicartVal:boolean){
    this.minicart.next(minicartVal);
  }

  getMiniCart():Observable<boolean>{
    return this.minicart.asObservable();
  }
}
