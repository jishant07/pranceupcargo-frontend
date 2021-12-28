import { GlobalService } from './../_services/global.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required]),
    passWord: new FormControl('',[Validators.required]),
  })

  constructor(private auth_service:AuthService,private global_service:GlobalService) { }

  ngOnInit(): void {}
  
  signOut(){
    this.auth_service.signOut();
  }
  submitForm(){
    if(this.loginForm.valid){
      this.auth_service.signIn(this.loginForm.value.email,this.loginForm.value.passWord)
    }else{
      this.global_service.openSnackBar("Fill details properly")
    }
  }
}
