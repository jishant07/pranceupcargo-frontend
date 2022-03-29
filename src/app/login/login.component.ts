import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './../_services/global.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { LoaderService } from '../_services/loader/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css' ],  
  //encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required]),
    passWord: new FormControl('',[Validators.required]),
  })

  constructor(private auth_service:AuthService,
    private global_service:GlobalService,
    public loader_service:LoaderService,
    private router:Router) { }

  ngOnInit(): void {}
  
  signOut(){
    this.auth_service.signOut();
  }
  submitForm(){
    if(this.loginForm.valid){
      this.loader_service.isLoading.next(true)
      this.auth_service.signIn(this.loginForm.value.email,this.loginForm.value.passWord).then((user:any) =>{
        this.loader_service.isLoading.next(false)
        localStorage.setItem("token",user.user.multiFactor.user.accessToken);
        this.global_service.openSnackBar("Signin Successful");
        this.auth_service.passAuthData();
        this.router.navigate(["/dashboard"])
      }).catch(err =>{
        console.log(err);
        this.loader_service.isLoading.next(false)
        this.global_service.openSnackBar(err.message);
      })
    }else{
      this.global_service.openSnackBar("Fill details properly")
    }
  }
}
