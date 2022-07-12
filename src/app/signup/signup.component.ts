import { Router } from '@angular/router';
import { LoaderService } from './../_services/loader/loader.service';
import { GlobalService } from './../_services/global.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    passWord: new FormControl('',[Validators.required]),
    rePassWord: new FormControl('',[Validators.required]),
    companyName: new FormControl('',[Validators.required]),
  })

  constructor(private authService:AuthService,
    private global_service:GlobalService,
    public loader_service:LoaderService,
    private router:Router,
    ) { }

  ngOnInit(): void {}

  fieldTextType: boolean;
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  fieldRePasswordTextType: boolean;
  toggleRePasswordFieldType() {
    this.fieldRePasswordTextType = !this.fieldRePasswordTextType;
  }

  signUp(){
    if(this.signupForm.valid && (this.signupForm.value.passWord == this.signupForm.value.rePassWord)){
      this.loader_service.isLoading.next(true);
      this.authService.signUp(this.signupForm.value).then((user:any) =>{

        //API call - api/auth/signup
        this.authService.afterSignup(this.signupForm.value).subscribe();

        this.loader_service.isLoading.next(false)
        localStorage.setItem("token",user.user.multiFactor.user.accessToken);
        this.global_service.openSnackBar("User Signed Up Successfully")
        this.authService.passAuthData();
        this.router.navigate(["/dashboard"])
      }).catch(err =>{
        console.log(err)
        this.loader_service.isLoading.next(false)
        this.global_service.openSnackBar(err.message);
      })
    }else{
      this.global_service.openSnackBar("Enter Details properly")
    }
  }

}
