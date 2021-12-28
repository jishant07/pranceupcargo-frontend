import { GlobalService } from './global.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth_service:AuthService,private router:Router,private global_service:GlobalService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.auth_service.isAuthenticated()){
      this.router.navigateByUrl("/login")
      this.global_service.openSnackBar("Login to continue")
    }
    return this.auth_service.isAuthenticated();
  }
  
}
