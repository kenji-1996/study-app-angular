import { Component, OnInit } from '@angular/core';
import {DataEmitterService} from "../../../services/data-emitter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataManagementService} from "../../../services/data-management.service";
import * as global from '../../../globals';
import {AuthenticateService} from "../../../services/authenticate.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class AuthLoginComponent implements OnInit {

    constructor( private dataManagement: DataManagementService,
                 private route: ActivatedRoute,
                 private router: Router,
                 private dataEmit: DataEmitterService,
                 private auth: AuthenticateService,
    ) { }

    model: any = {};

    ngOnInit() {
    }

    login() {
        let body =
            {
                username: this.model.username,
                password: this.model.password,
                rememberMe: this.model.rememberMe,
            };
        let encryptedAuth = btoa(this.model.username + ":" + this.model.password + ":" + this.model.rememberMe);
        this.dataManagement.getDATA(global.url + '/api/users', {
            'Authorization' : 'Basic ' + encryptedAuth,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
        }).subscribe(
            dataResult => {
                if(dataResult) {
                    this.dataEmit.pushUpdateArray(dataResult.message,'Welcome ' + dataResult.data.profile.name,'success');
                    this.auth.processLogin(dataResult.data);
                    this.router.navigate(['app/home']);
                }
            }
        );
    }



}
