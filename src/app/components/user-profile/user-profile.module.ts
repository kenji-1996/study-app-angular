import { Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthenticateService} from '../../services/authenticate.service';
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {ImportsModule} from "../../modules/imports.module";
import {fadeAnimate} from "../../misc/animation";
import {user} from "../../objects/objects";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    animations: [ fadeAnimate ],
})
export class UserProfileComponent implements OnInit {
    user: user;
    groups:any = [];

    constructor(
        public auth: AuthenticateService,
        private route: Router,
        private dataManagement: DataManagementService,
    ) {  }

    ngOnInit() {
        this.dataManagement.getDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id).subscribe(httpUser => {
            this.user = httpUser.data;
        });
        this.dataManagement.getDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/groups').subscribe(xd => {
            console.log(xd.data);
            for(let i = 0; i < xd.data.length; i++) {
                console.log(xd.data[i]);
                if(xd.data[i].staff.includes(JSON.parse(localStorage.getItem('userObject'))._id)) {
                    xd.data[i]['canModify'] = true;
                }
            }
            this.groups = xd.data;
        });
    }
}

@NgModule({
    declarations: [UserProfileComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: UserProfileComponent, pathMatch: 'full'}
        ]),
        ImportsModule,
    ]
})
export class UserProfileModule {

}

