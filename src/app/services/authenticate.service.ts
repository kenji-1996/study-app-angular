import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as global from '../globals';
import 'rxjs/add/operator/map'
import {Observable} from "rxjs/Observable";
import {DataEmitterService} from "./data-emitter.service";
import {Router} from "@angular/router";
declare const gapi: any;

@Injectable()
export class AuthenticateService {
    constructor(
        private http: HttpClient,
        public dataEmit: DataEmitterService,
        private router: Router,
    ) { }

    public processLogin(obj) {
        let parsedToken = this.parseJwt(obj.token);
        localStorage.setItem('token', obj.token);
        localStorage.setItem('exp', parsedToken.exp);
        localStorage.setItem('iat', parsedToken.iat);
        localStorage.setItem('logged','true');
        localStorage.setItem('userObject',JSON.stringify(obj.profile));
    }
    public parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    public localLoggedIn() {
        if(localStorage.getItem('logged')) {
            return true;
        }
    }

    public revoke()  {
        localStorage.removeItem('userObject');
        localStorage.removeItem('token');
        localStorage.removeItem('exp');
        localStorage.removeItem('iat');
        localStorage.removeItem('logged');
        this.router.navigate(['/auth/login']);
        this.dataEmit.pushUpdateArray('User signed out','User session','info');
    }

}