import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
export declare const gapi: any;
import * as global from '../globals';
import {CookieService} from "ngx-cookie-service";
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticateService {

  auth2;
  auth2access;

  constructor(private http: HttpClient,
              private cookieService: CookieService
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
            if(sessionStorage.getItem('idtoken') != gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token) {
              sessionStorage.setItem('idtoken', gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token);
            }
            this.validate(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token).subscribe(data => {});
          }
        });
      });
    } catch (ex) {  }
  }

  public validate(idtoken: string):any {
    var body = { idtoken : idtoken/*, type: 'list'*/ };
    return this.http.post(global.url + '/api/user', body, {}).map(result =>
    {
      this.cookieService.set('email', result['email'],30/1440,'session');
      this.cookieService.set('avatar', result['picture'],30/1440,'session');
      this.cookieService.set('name', result['name'],30/1440,'session');
      this.cookieService.set('perm', result['permissions'],30/1440,'session');
      this.cookieService.set('logged', 'true',30/1440,'session');
    });
  }

  public localLoggedIn() {
    if(this.cookieService.get('logged') == 'true') {
      return true;
    }
  }

  public loggedIn() {
    if (gapi && this.auth2 && this.auth2access) {
      return this.auth2access.isSignedIn.get();
    }
  }

  public revoke()  {
    this.cookieService.deleteAll('sessions');
    gapi.auth2.getAuthInstance().signOut();
  }

}

