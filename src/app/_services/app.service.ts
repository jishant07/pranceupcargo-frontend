import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry,catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http:HttpClient,private globalservice:GlobalService) { }
}
