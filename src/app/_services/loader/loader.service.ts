import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading:BehaviorSubject<any> = new BehaviorSubject<any>(false)

  constructor() { }
}
