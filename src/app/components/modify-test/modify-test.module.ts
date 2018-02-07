import { Component, OnInit,NgModule} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {DragulaService} from "ng2-dragula";
import {DataManagementService} from "../../services/data-management.service";
import {DataEmitterService} from "../../services/data-emitter.service";
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {SlideInOutAnimation, fadeAnimate} from "../../misc/animation";
import {ImportsModule} from "../../modules/imports.module";
import {EditTestComponent} from "../edit-test/edit-test.component";
import * as global from '../../globals';
import {SharedModule} from "../../modules/shared.module";

@Component({
    selector: 'app-modify-test',
    templateUrl: './modify-test.component.html',
    styleUrls: ['./modify-test.component.scss'],
    animations: [SlideInOutAnimation, fadeAnimate],
})
export class ModifyTestComponent implements OnInit {

    test;

    constructor(
        private dataManagement: DataManagementService,
        private activeRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((params: Params) => {
            let testId = params['testId'];
            this.test = testId;
            /*this.dataManagement.getDATA(global.url + '/api/tests/author/' + testId).subscribe(allocatedTestResult => {
                this.test = allocatedTestResult.data.test;
            });*/
        });

    }

}

@NgModule({
    declarations: [ModifyTestComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: ModifyTestComponent, pathMatch: 'full'}
        ]),
        ImportsModule,
        SharedModule
    ]
})
export class ModifyTestModule {

}
