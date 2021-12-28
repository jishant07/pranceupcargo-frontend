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
    userName: new FormControl('',[Validators.required]),
    passWord: new FormControl('',[Validators.required]),
  })

  constructor(private auth_service:AuthService) { }

  ngOnInit(): void {}

  signIn(){
    this.auth_service.signIn("jishanta@gmail.com","abcd@123")
  }
  signOut(){
    this.auth_service.signOut();
  }
  submitForm(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
    }else{
      console.log("Not Valid")
    }
  }
}
