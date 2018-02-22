import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
    HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import {DataEmitterService} from "../services/data-emitter.service"; // don't forget the imports


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let autHeader = localStorage.getItem('token')? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};

        request = request.clone({
            setHeaders: autHeader
        });

        return next.handle(request);
    }
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private dataEmitter: DataEmitterService) {  }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .catch((err: HttpErrorResponse) => {
                if(err.error == 'Unauthorized') {
                    this.dataEmitter.pushUpdateArray('Failed to validate your session, try logging back in','Authentication failed','error');
                }else{
                    if (err.error instanceof Error) {
                        console.error('An error occurred:', err.error.message);
                    } else {
                        this.dataEmitter.pushUpdateArray(err.error.message,err.statusText + ` ${err.status}`,'error');
                    }
                }
                return Observable.empty<HttpEvent<any>>();
            });
    }
}