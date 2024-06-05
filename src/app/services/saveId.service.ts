
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SaveIdService{
  constructor(){}
  productId = new BehaviorSubject<number>(0);
  categoryId = new BehaviorSubject<number>(0);
  userId = new BehaviorSubject<string>('')
  setProductId(val:number){
    this.productId.next(val)
  }

  setCategoryId(val:number){
    this.categoryId.next(val)
  }

  getProductId(): Observable<number> {
    return this.productId.asObservable()
  }

  getCategoryId(): Observable<number> {
    return this.categoryId.asObservable()
  }

  saveUserId(val:string){
    this.userId.next(val)
  }

  getUserId(): Observable<string> {
    return this.userId.asObservable()
  }
}
