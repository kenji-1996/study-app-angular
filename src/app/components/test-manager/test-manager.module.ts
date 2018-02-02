import {Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import {newTest, Test} from '../../objects/objects';
import {MatDialog} from "@angular/material";
import {DataEmitterService} from "../../services/data-emitter.service";
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";
import {Title} from "@angular/platform-browser";
import {NgIfMediaQuery} from "../../misc/media-query-directive";
import {fadeAnimate} from "../../misc/animation";
import {DialogData} from "../../dialogs/dialogData/dialog-data";

@Component({
  selector: 'app-test-manager',
  templateUrl: './test-manager.component.html',
  styleUrls: ['./test-manager.component.scss'],
  animations: [ fadeAnimate ],
})
export class TestManagerComponent implements OnInit {

  tests: newTest[];
  public cols: Observable<number>;

  constructor( public dataEmit: DataEmitterService,
               private data: DataManagementService,
               private dialog: MatDialog,
               private titleService: Title,

  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Authored tests - DigitalStudy');
    this.refreshData();
  }

  assignUserID(test:newTest,data:any): void{
    let dialogRef = this.dialog.open(DialogData, {data: data });
      dialogRef.afterClosed().subscribe((result:any) => {
        if(result && result.UserID) {
          let userID = result.UserID;
          let body = { testid: test._id };
          this.data.postDATA(global.url + '/api/users/' + userID + '/authored',body).subscribe(dataResult=> {
            if(dataResult) {
              console.log(dataResult);
              this.dataEmit.pushUpdateArray(dataResult.data.name + ' was assigned to ' + test.title,'New user assigned','success')
            }
          });
        }
      });
  }

  removeAllocatedTest(test:any,usertest:any) {
    let body = { testid: test._id, usertestid: usertest._id };
    this.data.deleteDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/authored/' + test._id + '/' + usertest._id, body).subscribe(dataResult=> {
      if(dataResult) {
        console.log(dataResult);
        this.dataEmit.pushUpdateArray(dataResult.message,'Allocated user removed','info')
      }
    });
  }

  markAllocatedTest(test:any) {
    alert('todo');
  }

  settingsAllocatedTest(test:any) {
    alert('todo');
  }

  removeTest(test:any) {
    alert('this will currently remove all question children, may change in future');
    this.data.deleteDATA(global.url + '/api/tests/' + test._id, {}).subscribe(dataResult=> { this.dataEmit.pushUpdateArray(dataResult.message) });
  }

  refreshData() {
    this.data.getDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/authored').subscribe(dataResult=> {
      if(dataResult) {
        this.tests = dataResult.data;
      }
    });
  }
}

@NgModule({
  declarations: [TestManagerComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: TestManagerComponent, pathMatch: 'full'}
    ]),
    ImportsModule,
  ]
})
export class TestManagerModule {

}

