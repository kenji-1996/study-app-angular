import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
export declare const gapi: any;
import * as global from '../globals';
import 'rxjs/add/operator/map'
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthenticateService {

  auth2;
  auth2access;

  constructor(private http: HttpClient
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
            var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
            if(localStorage.getItem('idtoken') != gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token) {
              localStorage.setItem('idtoken', gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token);
            }
            this.validate(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token).subscribe();
          }
        });
      });
    } catch (ex) {  }
  }

  public validate(idtoken: string): Observable<any> {
    var body = { idtoken : idtoken/*, type: 'list'*/ };
    return this.http.post(global.url + '/api/user', body, {});
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
    localStorage.removeItem('logged');
    localStorage.removeItem('idtoken');
    gapi.auth2.getAuthInstance().signOut();
  }

}