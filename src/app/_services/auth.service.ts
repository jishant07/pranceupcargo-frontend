import { BehaviorSubject, catchError, retry } from 'rxjs';
import { LoaderService } from './loader/loader.service';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token?:string;
  httpHeader:any;
  httpHeaderUrlencoded:any;
  getToken(){
    this.token = localStorage.getItem('token')!;
  }
  setHeader(){
    this.getToken();
    this.httpHeader = {
        'token': this.token as string
    };
    this.httpHeaderUrlencoded = {
      'token': this.token as string,
      'Content-Type': 'application/x-www-form-urlencoded'      
    };
  }

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

  afterSignup(data:any){    
    const body = {email: ''+data.email+''} 
    return this.http.post(environment.devURL+'/auth/signup',body,{headers: this.httpHeaderUrlencoded})    
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
