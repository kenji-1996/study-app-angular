import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as global from '../globals';
import 'rxjs/add/operator/map'
import {Observable} from "rxjs/Observable";
import {DataEmitterService} from "./data-emitter.service";
declare const gapi: any;

@Injectable()
export class AuthenticateService {

    auth2;
    auth2access;

    constructor(
        private http: HttpClient,
        public dataEmit: DataEmitterService,
    ) { }

    public initAuth() {
        try {
                gapi.load('auth2', () => {
                    this.auth2 = gapi.auth2.init({
                        client_id: '***REMOVED***'
                    }).then(() => {
                        if (gapi.auth2.getAuthInstance().isSignedIn.get() == false) {
                            this.revoke();
                        } else {
                            this.auth2access = gapi.auth2.getAuthInstance();
                            if (localStorage.getItem('idtoken') != gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token) {
                                localStorage.setItem('idtoken', gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token);
                            }
                            this.validate().subscribe(data => {
                                localStorage.setItem('userObject', JSON.stringify(data.data));
                                localStorage.setItem('logged', 'true');
                                this.dataEmit.pushLoggedIn(true);
                            });
                        }
                    });
                });
        } catch (ex) { console.log(ex); }
    }

    public validate(): Observable<any> {
        return this.http.post(global.url + '/api/users', {});
    }

    /**/

    public localLoggedIn() {
        if(localStorage.getItem('logged')) {
            return true;
        }
    }

    public loggedIn() {
        if (gapi && this.auth2 && this.auth2access) {
            return this.auth2access.isSignedIn.get();
        }
    }

    public revoke()  {
        return new Promise((resolve) => {
            localStorage.removeItem('userObject');
            localStorage.removeItem('idtoken');
            localStorage.removeItem('logged');
            this.dataEmit.pushLoggedIn(false);
            gapi.auth2.getAuthInstance().signOut().then(() => { resolve(true); });
        });

    }

}