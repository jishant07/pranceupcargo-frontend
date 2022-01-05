import { BehaviorSubject, catchError, retry } from 'rxjs';
import { LoaderService } from './loader/loader.service';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,
    private global_service:GlobalService,
    private afAuth:AngularFireAuth,
    public loader_service:LoaderService,private router:Router) {
  }

  isLoggedIn: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  signIn(email:string,password:string){
    return this.afAuth.signInWithEmailAndPassword(email,password);
  }

  signUp(data:any){
    return this.afAuth.createUserWithEmailAndPassword(data.email,data.passWord)
  }

  signOut(){
    return new Promise((resolve,reject) =>{
      this.loader_service.isLoading.next(true)
      this.afAuth.signOut().catch(err =>{
        reject(err);
      });
      this.global_service.openSnackBar("Logged Out Successfully")
      localStorage.removeItem("token")
      this.loader_service.isLoading.next(false)
      resolve("Done")
    })
  }

  getAuthData(){
    return this.isLoggedIn.asObservable();
  }
  passAuthData(){
    this.isLoggedIn.next(!!localStorage.getItem('token'))
  }

  isAuthenticated(){
    return !!localStorage.getItem('token');
  }

}
