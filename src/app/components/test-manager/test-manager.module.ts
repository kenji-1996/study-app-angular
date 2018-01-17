import {Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import { Test } from '../../objects/objects';
import {MatDialog} from "@angular/material";
import {AddTest} from "../../dialogs/addTest/add-test";
import {DataEmitterService} from "../../services/data-emitter.service";
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-test-manager',
  templateUrl: './test-manager.component.html',
  styleUrls: ['./test-manager.component.scss']
})
export class TestManagerComponent implements OnInit {

  tests: Test[];
  public cols: Observable<number>;

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

  addTest(): void{
    let dialogRef = this.dialog.open(AddTest, {data: {name: '',} });
      dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['/tests/edit',result]);
      });
  }

  removeTest(test:any) {
    this.data.deleteDATA(global.url + '/api/tests/' + test._id, {}).subscribe(dataResult=> { this.dataEmit.pushUpdateArray(dataResult.message) });
  }

  refreshData() {
    this.data.getDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/tests').subscribe(dataResult=> {
      this.tests = dataResult.data;
    });
  }
}

@NgModule({
  declarations: [TestManagerComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: TestManagerComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class TestManagerModule {

}

