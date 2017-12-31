import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {AuthenticateService} from "../../services/authenticate.service";
import {Router} from "@angular/router";
declare const gapi: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  clientid:string = '***REMOVED***';
  auth2:any;
  logged = false;

  constructor(private cookieService: CookieService,
              public auth: AuthenticateService,
              private route: Router
  ) { }

  ngOnInit() {

    this.logged = this.auth.localLoggedIn();
  }

  ngAfterViewInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.getAuthInstance({
        client_id: this.clientid,
        accesstype: 'offline',
        scope: '',
        approval_prompt: 'force'
      });
      if(!this.logged) {
        this.attachSignin(document.getElementById('glogin'));
      }
    });
  }

  public attachSignin(element) {
    if(!this.auth.loggedIn()) {
      this.auth2.attachClickHandler(element, {},
          (loggedInUser) => {

            var idtoken = loggedInUser.getAuthResponse().id_token;
            this.cookieService.set('idtoken',idtoken,30/1440,'session');
            this.auth.validate(idtoken).subscribe(data => {
              alert("Logged in as " + this.cookieService.get('name'));
              //that._ngZone.run(() => );
              this.route.navigate(['/user'])
            });
          }, function (error) {
            alert("Error: " + error.error);
          });
    }
  }
}
