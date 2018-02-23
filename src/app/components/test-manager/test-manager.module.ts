import {ChangeDetectionStrategy, Component, NgModule, OnInit, Input} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import {newTest} from '../../objects/objects';
import {MatDialog} from "@angular/material";
import {DataEmitterService} from "../../services/data-emitter.service";
import {Subject, Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import {Title} from "@angular/platform-browser";
import {fadeAnimate, SlideInOutAnimation} from "../../misc/animation";
import {DialogData} from "../../dialogs/dialogData/dialog-data";
import {NgxPaginationModule, PaginationInstance} from "ngx-pagination";

@Component({
    selector: 'app-test-manager',
    templateUrl: './test-manager.component.html',
    styleUrls: ['./test-manager.component.scss'],
    animations: [ SlideInOutAnimation, fadeAnimate ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class TestManagerComponent implements OnInit {

    @Input('data') tests;
    total;
    page;
    itemLimit = 2;
    filter: string = '';
    sort;
    shouldSort = false;
    loading: boolean;
    autoHide = false;
    public keyUp = new Subject<any>();
    animationState = 'out';

    public config: PaginationInstance = {
        id: 'advanced',
        itemsPerPage: 2,
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
        this.titleService.setTitle('Authored tests - DigitalStudy');
        this.getPage(1);
    }


    getPage(page: number) {
        this.animationState = 'out';
        this.tests = null;
        this.data.getDATA(global.url + '/api/users/' +  JSON.parse(localStorage.getItem('userObject'))._id +  '/authored?page=' + page + '&limit=' + this.itemLimit + (this.filter? ('&search=' + this.filter) : '') + (this.sort? ('&sort=' + this.sort) : '')).subscribe(res => {
            this.total = res.data.total;
            this.tests = res.data.docs;
            this.config.currentPage = page;
            this.page = page;
            this.animationState = 'in';
            console.log(this.tests);
        });
    }

    onChange(deviceValue) {
        this.getPage(this.page);
    }

    assignUserID(test:newTest,data:any): void{
        let dialogRef = this.dialog.open(DialogData, {data: data });
        dialogRef.afterClosed().subscribe((result:any) => {
            if(result && result.Username) {
                let username = result.Username;
                let body = {
                    testid: test._id,
                    username: username,
                };
                this.data.postDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/authored',body).subscribe(dataResult=> {
                    if(dataResult) {
                        console.log(dataResult);
                        this.dataEmit.pushUpdateArray(dataResult.data.name + ' was assigned to ' + test.title,'New user assigned','success');
                        this.getPage(this.page);
                    }
                });
            }
        });
    }

    removeAllocatedTest(test:any,usertest:any) {
        let body = { testid: test._id, usertestid: usertest._id };
        this.data.deleteDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/authored/' + test._id + '/' + usertest._id, body).subscribe(dataResult=> {
            if(dataResult) {
                this.dataEmit.pushUpdateArray(dataResult.message,'Allocated user removed','info');
                this.getPage(this.page);
            }
        });
    }

    settingsAllocatedTest(test:any) {
        alert('Not yet implimented');
    }

    lockTest(test:any) {
        let body = { test: { locked: !test.locked}};
        this.data.putDATA(global.url + '/api/tests/' + test._id, body).subscribe(dataResult=> { this.dataEmit.pushUpdateArray(dataResult.message);this.getPage(this.page); });
    }

    removeTest(test:any) {
        alert('this will currently remove all question children, may change in future');
        this.data.deleteDATA(global.url + '/api/tests/' + test._id, {}).subscribe(dataResult=> { this.dataEmit.pushUpdateArray(dataResult.message);this.getPage(this.page); });
    }
}

@NgModule({
    declarations: [TestManagerComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: TestManagerComponent, pathMatch: 'full'}
        ]),
        ImportsModule,
        NgxPaginationModule,
    ]
})
export class TestManagerModule {

}

