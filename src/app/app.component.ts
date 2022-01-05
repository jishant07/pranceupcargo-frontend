import { LoaderService } from './_services/loader/loader.service';
import { Component } from '@angular/core';
import { AppService } from './_services/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pranceup';
  constructor(private appservice:AppService,private router:ActivatedRoute,public loader_service:LoaderService){}
  navigate(){
    
  }
}
