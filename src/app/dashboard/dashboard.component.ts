import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    //'./dashboard.component.css'
    '../../assets/libs/jsvectormap/css/jsvectormap.min.css',
    '../../assets/libs/swiper/swiper-bundle.min.css',
    '../../assets/css/bootstrap.min.css',
    '../../assets/css/icons.min.css',
    // '../../assets/css/app.min.css',
    '../../assets/css/custom.min.css'
  ],  
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
