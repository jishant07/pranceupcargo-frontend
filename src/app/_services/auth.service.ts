import { catchError, retry } from 'rxjs';
import { LoaderService } from './loader/loader.service';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,
    private global_service:GlobalService,
    private afAuth:AngularFireAuth,
    public loader_service:LoaderService) {
    this.afAuth.authState.subscribe((user:any) =>{
      if(user){
        localStorage.setItem("token",user.multiFactor.user.accessToken);
        localStorage.setItem("isAuthenticated","true")
      }else{
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token")
      }
    })
  }

  signIn(email:string,password:string){
    this.loader_service.isLoading.next(true)
    this.afAuth.signInWithEmailAndPassword(email,password).then(user =>{
      this.global_service.openSnackBar("User Logged In successfully")
      this.loader_service.isLoading.next(false)
    }).catch(err =>{
      this.global_service.openSnackBar(err.message);
      this.loader_service.isLoading.next(false)
    })
  }

  signUp(email:string,password:string){
    this.loader_service.isLoading.next(true)
    this.afAuth.createUserWithEmailAndPassword(email,password).then(user =>{
      this.global_service.openSnackBar("User Signed Up Successfully");
      this.loader_service.isLoading.next(false)
    }).catch(err =>{
      this.global_service.openSnackBar(err.message);
      this.loader_service.isLoading.next(false)
    })
  }

  signOut(){
    this.loader_service.isLoading.next(true)
    this.afAuth.signOut();
    this.global_service.openSnackBar("Logged Out Successfully")
    this.loader_service.isLoading.next(false)
  }

  isAuthenticated(){
    if(localStorage.getItem("token") && localStorage.getItem('isAuthenticated') && localStorage.getItem("isAuthenticated") == "true"){
      return true;
    }else{
      return false;
    }
  }

}
