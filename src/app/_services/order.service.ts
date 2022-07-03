import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      console.log('Service placeOrder');
      console.log(formData);
      //return this.http.post(environment.devURL+"/order/placeNewOrder", data, {headers: this.httpHeader});

      // return this.http.post(environment.devURL+"/order/placeNewOrder",{
      //   method: 'POST',
      //   body: formData
      // });

      // return this.http.post(environment.devURL+"/order/placeNewOrder",{
      //   method: 'POST',
      //   body: formData,
      //   'token': this.token as string,
      //   'Content-Type': 'multipart/form-data'
      // });

      return this.http.post(environment.devURL+"/order/placeNewOrder",{
        method: 'POST',
        body: formData,
        token: this.token as string,
        contentType: 'multipart/form-data'       
      });
  }
  //End: Order
}
