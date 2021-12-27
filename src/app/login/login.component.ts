import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth_service:AuthService) { }

  ngOnInit(): void {}

  signIn(){
    this.auth_service.signIn("jishanta@gmail.com","abcd@123")
  }
  signOut(){
    this.auth_service.signOut();
  }
}
