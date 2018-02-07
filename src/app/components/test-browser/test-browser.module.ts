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

    getPage(page: number) {
        this.animationState = 'out';
        this.tests = null;
        this.data.getDATA(global.url + '/api/tests?page=' + page + '&limit=' + this.itemLimit + (this.filter? ('&search=' + this.filter) : '') + (this.sort && this.shouldSort? ('&sort=' + this.sort) : '')).subscribe(res => {
            this.total = res.data.total;
            this.tests = res.data.docs;
            this.config.currentPage = page;
            this.page = page;
            this.animationState = 'in';
        });
    }

    searchType() {
        setTimeout(() => this.getPage(this.page), 5000);
    }

    sortCheck() {
        this.shouldSort = !this.shouldSort;
        if(!(this.shouldSort && !this.sort)) {
            this.getPage(this.page);
        }
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

