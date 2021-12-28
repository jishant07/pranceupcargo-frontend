import { LoaderService } from './loader.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(public loader_service:LoaderService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loader_service.isLoading.next(true);
    let token = localStorage.getItem("token")
    if (token === null) token = "null"
    req = req.clone({
      setHeaders:{
        token
      }
    })
    return next.handle(req).pipe(
      finalize(()=>{
        this.loader_service.isLoading.next(false);
      })
    )
  }
}
