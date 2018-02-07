import { Component, OnInit,NgModule} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {SlideInOutAnimation, fadeAnimate} from "../../misc/animation";
import {ImportsModule} from "../../modules/imports.module";
import {SharedModule} from "../../modules/shared.module";
@Component({
    selector: 'app-create-test',
    templateUrl: './create-test.component.html',
    styleUrls: ['./create-test.component.scss'],
    animations: [SlideInOutAnimation, fadeAnimate],
})
export class CreateTestComponent implements OnInit {

    constructor() {

    }

    ngOnInit() {

    }
}

@NgModule({
    declarations: [CreateTestComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateTestComponent, pathMatch: 'full'}
        ]),
        ImportsModule,
        SharedModule
    ]
})
export class CreateTestModule {

}
