import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeaheadService {

  constructor(private http:HttpClient) { }

  getCountries(){
    return this.http.get(environment.devURL+"/app/listCountries")
  }
}
