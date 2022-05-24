import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../_services/global.service';
import { SwitchThemeService } from '../_services/switch-theme';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    //'./home.component.css'
    // "../../assets/css/web/normalize.css",
    // "../../assets/css/web/animate.css",
    // "../../assets/css/web/stellarnav.min.css",
    // "../../assets/css/web/owl.carousel.css",
    // "../../assets/css/web/bootstrap.min.css",
    // "../../assets/css/web/font-awesome.min.css",
    // "../../assets/css/web/style.css",
    // "../../assets/css/web/responsive.css"
  ],  
  // encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {

  // constructor(private switchtheme: SwitchThemeService) { }
  constructor(private global_service: GlobalService) { }

  ngOnInit(): void {
    this.global_service.checksignedin();
  }

}
