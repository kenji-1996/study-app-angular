import { Component, OnInit } from '@angular/core';
import {AuthenticateService} from "../../services/authenticate.service";
import {Router} from "@angular/router";
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
    selector: 'app-log-out',
    templateUrl: './log-out.component.html',
    styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent implements OnInit {

    constructor(
        private auth: AuthenticateService,
        private router: Router,
        private dataEmit: DataEmitterService,
    ) { }

    ngOnInit() {
        this.auth.revoke();
    }

}
