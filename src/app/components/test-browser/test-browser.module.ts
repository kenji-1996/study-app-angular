import {ChangeDetectionStrategy, Component, NgModule, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import {allocatedTest, newTest} from '../../objects/objects';
import {DataEmitterService} from "../../services/data-emitter.service";
import {Subject, Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import {Title} from "@angular/platform-browser";
import {fadeAnimate,SlideInOutAnimation} from "../../misc/animation";
import {NgxPaginationModule, PaginationInstance} from "ngx-pagination";
import {SearchPipe} from "../../pipes/search.pipe";
import {StringFilterPipe} from "../../pipes/string-filter.pipe";


@Component({
    selector: 'app-test-browser',
    templateUrl: './test-browser.component.html',
    styleUrls: ['./test-browser.component.scss'],
    animations: [ SlideInOutAnimation, fadeAnimate ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class TestBrowserComponent implements OnInit {

    @Input('data') tests;
    total;
    page;
    itemLimit = 5;
    filter: string = '';
    oldSort;
    sort;
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
        this.titleService.setTitle('Public test library - DigitalStudy');
    }

    getPage(page: number) {
        this.animationState = 'out';
        this.tests = null;
        this.data.getDATA(global.url + '/api/tests?page=' + page + '&limit=' + this.itemLimit + (this.filter? ('&search=' + this.filter) : '') + (this.sort? ('&sort=' + this.sort) : '')).subscribe(res => {
            this.total = res.data.total;
            this.tests = res.data.docs;
            this.config.currentPage = page;
            this.page = page;
            this.animationState = 'in';
        });
    }

    isAllocated(test:any) {
        if(!test.selfAllocatedTestList.length) { return false; }
        for(let i = 0; i < test.selfAllocatedTestList.length; i++) {
            if(test.selfAllocatedTestList[i].user === JSON.parse(localStorage.getItem('userObject'))._id){
                return test.selfAllocatedTestList[i]._id;
            }
        }
    }

    onChange(deviceValue) {
        this.getPage(this.page);
    }

    allocateTest(test:any) {
        let body = { testid: test._id };
        this.data.postDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/tests/self',body).subscribe(dataResult=> {
            if(dataResult) {
                this.dataEmit.pushUpdateArray(dataResult.data.name + ' was assigned to ' + test.title,'New user assigned','success');
                this.getPage(this.page);
            }
        });
    }
    unallocateTest(test:any) {
        this.data.deleteDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/tests/self/' + test._id,{}).subscribe(dataResult=> {
            if(dataResult) {
                this.dataEmit.pushUpdateArray(dataResult.message);
                this.getPage(this.page);
            }
        });
    }
}

@NgModule({
    declarations: [TestBrowserComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: TestBrowserComponent, pathMatch: 'full'}
        ]),
        ImportsModule,
        NgxPaginationModule,
    ]
})
export class TestBrowserModule {

}

