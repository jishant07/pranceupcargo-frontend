import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalService } from './global.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  token?:string;
  httpHeader:any;
  isLoading:boolean = false;

  constructor(
      private http:HttpClient
      ,private globalservice:GlobalService) { }

  getToken(){
    this.token = localStorage.getItem('token')!;
  }
  setHeader(){
    this.getToken();
    this.httpHeader = {
        'token': this.token as string
    };
  }

  //Begin: Order
  placeOrder(formData:FormData){
      return this.http.post(environment.devURL+"/order/placeNewOrder",formData);
  }
  //End: Order
}
