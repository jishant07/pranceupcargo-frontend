import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { HttpHeaders } from '@angular/common/http';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class TypeaheadService {  
  token?:string; 
  httpHeader:any;

  constructor(private http:HttpClient) { 
    this.setHeader(); 
  }

  getToken(){
    this.token = localStorage.getItem('token')!;
  }
  setHeader(){
    this.getToken();
    this.httpHeader = {'token': this.token as string};
    //console.log(environment.devURL+"/app/listCountries",{'headers': this.httpHeader});
  }

  getCountries(){
    return this.http.get(environment.devURL+"/app/listCountries")
  }

  getPortsByCountry(placeId:string){
    return this.http.post(environment.devURL+"/app/getPortsByCountry",{placeId})
  }

  getAirportByCountry(placeId:string){
    return this.http.post(environment.devURL+"/app/getAirportsByCountry",{placeId})
  }

  getIndianPorts(){
    return this.http.get(environment.devURL+"/app/getIndianPorts",{headers: this.httpHeader})
  }
  getPortsExceptIndia(){
    return this.http.get(environment.devURL+"/app/listPorts",{headers: this.httpHeader})
  }

  getIndianAirports(){
    return this.http.get(environment.devURL+"/app/getIndianAirports",{headers: this.httpHeader})
  }
  getAirportsExceptIndia(){
    return this.http.get(environment.devURL+"/app/listAirports",{headers: this.httpHeader})
  }

}
