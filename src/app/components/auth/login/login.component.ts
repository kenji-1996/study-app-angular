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
        this.dataManagement.postDATA(global.url + '/api/auth/login', body).subscribe(
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
