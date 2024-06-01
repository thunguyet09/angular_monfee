import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';
import { API } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  currentUserRole = new BehaviorSubject<string>('');
  constructor(private api: API) {
    const storedUser = localStorage.getItem('user');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    if(storedUser){
      const user = JSON.parse(storedUser) as User;
      this.currentUserRole.next(user.role);
    }
  }

  public setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  public logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }
}
