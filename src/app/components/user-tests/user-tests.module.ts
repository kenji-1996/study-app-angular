import {ChangeDetectionStrategy, Component, NgModule, OnInit, Input} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import {allocatedTest} from '../../objects/objects';
import {MatDialog} from "@angular/material";
import {DataEmitterService} from "../../services/data-emitter.service";
import { ObservableMedia } from '@angular/flex-layout';
import {Subject, Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import {Title} from "@angular/platform-browser";
import {fadeAnimate, SlideInOutAnimation} from "../../misc/animation";
import {NgxPaginationModule, PaginationInstance} from "ngx-pagination";

@Component({
    selector: 'app-test-manager',
    templateUrl: './user-tests.component.html',
    styleUrls: ['./user-tests.component.scss'],
    animations: [ SlideInOutAnimation, fadeAnimate ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserTestsComponent implements OnInit {
    @Input('data') tests;
    total;
    page;
    itemLimit = 5;
    filter: string = '';
    sort;
    shouldSort = false;
    loading: boolean;
    autoHide = false;
    public keyUp = new Subject<any>();
    animationState = 'out';
    public config: PaginationInstance = {
        id: 'advanced',
        itemsPerPage: 5,
        currentPage: 1
    };
    public labels: any = {
        previousLabel: 'Previous',
        nextLabel: 'Next',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };

    constructor( public dataEmit: DataEmitterService,
                 private data: DataManagementService,
                 private dialog: MatDialog,
                 private observableMedia: ObservableMedia,
                 private router: Router,
                 private titleService: Title,

    ) {
        const subscription = this.keyUp
            .map(event => event.target.value)
            .debounceTime(250)
            .distinctUntilChanged()
            .flatMap(search => Observable.of(search).delay(250))
            .subscribe(() => this.getPage(this.page));
    }

    ngOnInit() {
        this.getPage(1);
        this.titleService.setTitle('Your tests - DigitalStudy');
    }

    removeTest(test:any) {
        alert('should check settings to see if removable/usable');
        //test.test.canSelfRemove?
        /*console.log('attempting to remove ' + JSON.stringify(test));
         this.data.deleteDATA(global.url + '/api/tests/' + test._id, {}).subscribe(dataResult=> { this.dataEmit.pushUpdateArray(dataResult.message) });*/
    }

    getPage(page: number) {
        this.animationState = 'out';
        this.tests = null;
        this.data.getDATA(global.url + '/api/users/'  + JSON.parse(localStorage.getItem('userObject'))._id +  '/tests/self?page=' + page + '&limit=' + this.itemLimit + (this.filter? ('&search=' + this.filter) : '') + (this.sort? ('&sort=' + this.sort) : '')).subscribe(res => {
            console.log(res.data);
            this.total = res.data.total;
            //Hacky client side filtering, can be done server side but moved to save processing, could be moved back
            let index;
            res.data.docs.some(function (a, i) { if (a.test === null) { index = i; return true; }}) && res.data.docs.splice(index, 1);
            this.tests = res.data.docs;
            this.config.currentPage = page;
            this.page = page;
            this.animationState = 'in';
        });
    }

    onChange(deviceValue) {
        this.getPage(this.page);
    }

    unallocateTest(allocatedTest:any) {
        this.data.deleteDATA(global.url + '/api/tests/' + allocatedTest.test._id + '/self/' + allocatedTest._id,{}).subscribe(dataResult=> {
            if(dataResult) {
                console.log(dataResult);
                this.dataEmit.pushUpdateArray(dataResult.message);
                this.getPage(this.page);
            }
        });
    }
}

@NgModule({
    declarations: [UserTestsComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: UserTestsComponent, pathMatch: 'full'}
        ]),
        ImportsModule,
        NgxPaginationModule,
    ]
})
export class UserTestsModule {

}

