import { Component, OnInit } from '@angular/core';
import {SlideInOutAnimation} from "../../../misc/animation";
import {DataManagementService} from "../../../services/data-management.service";
import {DataEmitterService} from "../../../services/data-emitter.service";
import * as global from '../../../globals';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    animations: [SlideInOutAnimation ],
})
export class RegisterComponent implements OnInit {

    constructor(
        private dataManagement: DataManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private dataEmit: DataEmitterService
    ) { }

    model: any = {};
    showSettingsState = 'out';

    ngOnInit() {
    }

    register() {
        let body =
            {
                username: this.model.username,
                email: this.model.email,
                password: this.model.password,
                name: this.model.name,
                picture: this.model.picture,
            };
        this.dataManagement.postDATA(global.url + '/api/users', body).subscribe(
            dataResult => {
                if(dataResult) {
                    this.dataEmit.pushUpdateArray(dataResult.message);
                    this.router.navigate(['../login'], { relativeTo: this.route });
                }
            }
        );
    }

}
