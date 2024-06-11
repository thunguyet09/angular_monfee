import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription, map, switchMap } from "rxjs";
import { TokenResetPasswordService } from "../services/token_reset_password.service";

@Injectable({
  providedIn: 'root'
})
export class API{
  url = 'http://localhost:3000'

  constructor(private http: HttpClient){}

  public token = localStorage.getItem('jwt')
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

  getAllCategories(): Observable<any> {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(this.url + '/categories', { headers });
  }

  getCategoryPagination(page:any, limit:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(this.url + '/categories/pagination/' + page + '/' + limit, {headers})
  }

  getCategoryDetail(id:number){
    return this.http.get(this.url + `/categories/${id}`)
  }

  updateCategory(id:number, data:any){
    return this.http.put(this.url + `/categories/${id}`, data)
  }

  addCategory(data: any){
    return this.http.post(this.url + '/categories', data)
  }

  deleteCategory(id: number){
    return this.http.delete(this.url + `/categories/${id}`)
  }

  addProduct(data: any){
    return this.http.post(this.url + '/products', data)
  }

  deleteProduct(id: number){
    return this.http.delete(this.url + `/products/${id}`)
  }

  productPagination(page:any, limit:any){
    return this.http.get(this.url + '/products/' + page + '/' + limit)
  }

  updateProduct(id: number, data: any){
    return this.http.put(this.url + `/products/${id}`, data)
  }

  getNewsApproved(){
    return this.http.get(this.url + '/news')
  }

  postRegister(data: any){
    return this.http.post(this.url + '/users/register', data)
  }

  postLogin(data: any){
    return this.http.post(this.url + '/users/login', data)
  }

  getUserById(id: string){
    return this.http.get(this.url + `/users/${id}`)
  }

  sendResetPasswordLink(data: any){
    return this.http.post(this.url + '/users/reset-password', data)
  }

  getUserByToken(token:any){
    return this.http.get(this.url + `/users/token/${token}`)
  }

  comparePassword(data:any){
    return this.http.post(this.url + `/users/compare-password`, data)
  }

  newPassword(data:any, id:string){
    return this.http.post(this.url + `/users/new-password/${id}`, data)
  }

  removeToken(id:string){
    return this.http.delete(this.url + `/users/remove-token/${id}`)
  }

  refreshToken(refresh_token:string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refresh_token}`
    });
    return this.http.post(`${this.url}/users/refresh-token`, {}, { headers });
  }
}
