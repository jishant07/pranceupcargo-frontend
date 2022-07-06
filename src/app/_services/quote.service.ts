import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GlobalService } from './global.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
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
    this.httpHeader = {'token': this.token as string};
  }

  //Begin: Quote
  quoteOnHold(data:any){  
      return this.http.post(environment.devURL+"/quote/placeOnHold", data, {headers: this.httpHeader});
      //{status: 'success', message: 'qtyOFyP20ClbVz7Syz06'}
  }
  getQuotes(quoteState:string){
    //quoteState = ACTIVE / EXPIRED
    if(quoteState.length==0){ quoteState = 'ACTIVE';}
      return this.http.get(environment.devURL+"/quote/listAllQuotes?quoteState="+quoteState,{headers: this.httpHeader});
      //{status: 'success', message: Array(9)}
  }
  //End: Quote
}
