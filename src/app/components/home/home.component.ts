import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
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

    constructor(
                public auth: AuthenticateService,
                private route: Router,
                private zone:NgZone
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
            this.attachSignin(document.getElementById('glogin'));
        });
    }

    public attachSignin(element) {
        this.auth2.attachClickHandler(element, {},
            (loggedInUser) => {
                var idtoken = loggedInUser.getAuthResponse().id_token;
                localStorage.setItem('idtoken',idtoken);
                this.auth.validate(idtoken).subscribe(result => {
                    console.log(result);
                    localStorage.setItem('email', result['email']);
                    localStorage.setItem('avatar', result['picture']);
                    localStorage.setItem('name', result['name']);
                    localStorage.setItem('perm', result['permissions']);
                    localStorage.setItem('logged', 'true');
                    //Zone needed to properly load
                    this.zone.run(() => this.route.navigate(['/user']));
                });
            }, function (error) {
                alert("Error: " + error.error);
            });
    }
}
