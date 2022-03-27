import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwitchThemeService } from '../_services/switch-theme';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],  
  // encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {

  constructor(private switchtheme: SwitchThemeService) { }

  ngOnInit(): void {
  }

}
