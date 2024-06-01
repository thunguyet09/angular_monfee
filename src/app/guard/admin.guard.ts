// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../helpers/user-role';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  public userRole: string = '';
  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUserRole.subscribe((user) => {
      this.userRole = user;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userRole === UserRole.Admin) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
