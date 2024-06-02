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

  getAllCategories(){
    return this.http.get(this.url + '/categories')
  }

  getCategoryPagination(page:any, limit:any){
    return this.http.get(this.url + '/categories/pagination/' + page + '/' + limit)
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
}
