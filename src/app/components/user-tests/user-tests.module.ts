import {Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import {allocatedTest} from '../../objects/objects';
import {MatDialog} from "@angular/material";
import {DataEmitterService} from "../../services/data-emitter.service";
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";
import {Title} from "@angular/platform-browser";
import {fadeAnimate} from "../../misc/animation";

@Component({
  selector: 'app-test-manager',
  templateUrl: './user-tests.component.html',
  styleUrls: ['./user-tests.component.scss'],
  animations: [ fadeAnimate ],
})
export class UserTestsComponent implements OnInit {

  allocatedTests: allocatedTest[];
  public cols: Observable<number>;
  cameras: any[] = [];

  constructor( public dataEmit: DataEmitterService,
               private data: DataManagementService,
               private dialog: MatDialog,
               private observableMedia: ObservableMedia,
               private router: Router,
               private titleService: Title,

  ) {
    dataEmit.$updateArray.subscribe(() => {
      this.refreshData();
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Your tests - DigitalStudy');
    const grid = new Map([
      ["xs", 1],
      ["sm", 2],
      ["md", 3],
      ["lg", 4],
      ["xl", 5]
    ]);
    let start: number;
    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });
    this.cols = this.observableMedia.asObservable()
        .map(change => {return grid.get(change.mqAlias);}).startWith(start);
    this.refreshData();
  }

  removeTest(test:any) {
    alert('should check settings to see if removable/usable');
    /*console.log('attempting to remove ' + JSON.stringify(test));
     this.data.deleteDATA(global.url + '/api/tests/' + test._id, {}).subscribe(dataResult=> { this.dataEmit.pushUpdateArray(dataResult.message) });*/
  }

  refreshData() {
    this.data.getDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/tests').subscribe(dataResult=> {
      if(dataResult.data != null) {
        this.allocatedTests = dataResult.data;
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
  ]
})
export class UserTestsModule {

}
