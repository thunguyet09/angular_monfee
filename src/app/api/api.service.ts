import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class API{
  url = 'http://localhost:3000'

  constructor(private http: HttpClient){}
  getAllProducts(){
    return this.http.get(this.url + '/products')
  }

  getDetail(id:any){
    return this.http.get(this.url + `/products/${id}`)
  }

  getCarts(){
    return this.http.get(this.url + '/cart')
  }

  getThemes(){
    return this.http.get(this.url + '/theme')
  }
}
