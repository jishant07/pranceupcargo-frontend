import { GlobalService } from './../_services/global.service';
import { LoaderService } from './../_services/loader/loader.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loginState:boolean = false;
  constructor(private router:Router,
    public loader_service:LoaderService,
    private auth_service:AuthService,
    private global_service:GlobalService) {}
  ngOnInit(): void {
    this.auth_service.getAuthData().subscribe(res =>{
      this.loginState = res;
    })
  }
  logout(){
    this.auth_service.signOut().then(res =>{
      this.router.navigate(["/"])
      this.auth_service.passAuthData();
    }).catch(err =>{
      this.global_service.openSnackBar(err)
    })
  }

}
