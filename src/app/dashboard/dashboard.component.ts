import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../_services/script.service';

const js_path = '/src/assets/js/app.js';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],  
})
export class DashboardComponent implements OnInit {

  constructor( 
    private scriptService : ScriptService
    ) { }

  ngOnInit(): void {
    this.sidebarToggle();
    this.scriptService.loadJsScript(js_path);
  }
  
  sidebarToggle(){
    $(document).ready(function() {

      var dataSidebarSize = $('html').attr('data-sidebar-size');
      var sidebarFullTitle = $('#sidebar-title').text();      
      var sidebarShortTitle = 'PC';

      dataSidebarSize = 'lg';
      
      $('#topnav-hamburger-icon').on('click', function () {
        //Toggle icon
        $('.hamburger-icon').toggleClass('open');
        toggleSidebarWidth();
      });//#topnav-hamburger-icon click-event

      $('body,html').click(function(){
        $('#topnav-hamburger-icon').click();
     });

     function toggleSidebarWidth(){
       //Toggle sidebar width
       if($('.hamburger-icon').hasClass('open')){
        $('html').attr('data-sidebar-size','sm');
        $('#sidebar-title').text(sidebarShortTitle);
      }
      else {
        $('html').attr('data-sidebar-size', dataSidebarSize);
        $('#sidebar-title').text(sidebarFullTitle);
      }
     };
    });
  }
}
