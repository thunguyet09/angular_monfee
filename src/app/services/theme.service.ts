
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { API } from "../api/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Theme } from "../models/Theme";

@Injectable({
  providedIn: 'root'
})
export class ThemeService{
  constructor(private http: HttpClient, private api: API){}
  themes = new BehaviorSubject<string>('');
  url = 'http://localhost:3000'

  setTheme(bgColor:string, id:number){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.put<string>(this.url + `/${id}`, bgColor, httpOptions)
  }

  public themeData:Theme[] = []
  getTheme(): Observable<Theme[]> {
    return this.api.getThemes().pipe(
      map((data: any) => {
        return this.themeData = data;
      })
    );
  }
}
