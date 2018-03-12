import {Component, NgModule, OnInit} from '@angular/core';
import {SlideInOutAnimation} from "../../misc/animation";
import {DataManagementService} from "../../services/data-management.service";
import {DataEmitterService} from "../../services/data-emitter.service";
import * as global from '../../globals';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
    animations: [SlideInOutAnimation ],
})
export class GroupComponent implements OnInit {

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

    registerGroup() {
        let body =
            {
                name: this.model.name,
                private: this.model.private,
            };
        this.dataManagement.postDATA(global.url + '/api/groups', body).subscribe(
            dataResult => {
                if(dataResult) {
                    this.dataEmit.pushUpdateArray(dataResult.message);
                    //this.router.navigate(['../login'], { relativeTo: this.route });
                }
            }
        );
    }

}

@NgModule({
    declarations: [GroupComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: GroupComponent, pathMatch: 'full'}
        ]),
        ImportsModule,
    ]
})
export class GroupModule {

}

