import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
  isView = new BehaviorSubject<boolean>(true);

  setView(val:boolean){
    this.isView.next(val);
  }

  getView():Observable<boolean>{
    return this.isView.asObservable();
  }
}
