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
  getOrders(orderState:string){
    //orderState = ACTIVE / COMPLETED
    if(orderState.length==0){ orderState = 'ACTIVE';}
    return this.http.get(environment.devURL+"/order/listOrders?orderState="+ orderState,{headers: this.httpHeader});
    //{status: 'success', message: Array(9)}
  }
  getOrder(orderId:string){
    return this.http.post(environment.devURL+"/order/getOrderById",orderId,{headers: this.httpHeader});
  }
  //End: Order
}
