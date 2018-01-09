import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
export declare const gapi: any;
import * as global from '../globals';
import 'rxjs/add/operator/map'
import {Observable} from "rxjs/Observable";
import {DataEmitterService} from "./data-emitter.service";

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
        }).then( () =>
        {
          if(gapi.auth2.getAuthInstance().isSignedIn.get() == false) {
            this.revoke();
          }else{
            this.auth2access = gapi.auth2.getAuthInstance();
            if(localStorage.getItem('idtoken') != gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token) {
              localStorage.setItem('idtoken', gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token);
            }
            this.validate().subscribe(data => {
                localStorage.setItem('userObject', JSON.stringify(data.data));
                localStorage.setItem('logged','true');
                this.dataEmit.pushLoggedIn(true);
            });
          }
        });
      });
    } catch (ex) {  }
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
    localStorage.removeItem('userObject');
    localStorage.removeItem('idtoken');
    localStorage.removeItem('logged');
    this.dataEmit.pushLoggedIn(false);
    gapi.auth2.getAuthInstance().signOut().then(() => { console.log("Signed out"); });
  }

}