import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';

@Injectable()
export class ValidatorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let name: string = request.url.split("/").pop()!

    if(name.length > 2){
      return next.handle(request);
    }
    return EMPTY
    
  }
}
