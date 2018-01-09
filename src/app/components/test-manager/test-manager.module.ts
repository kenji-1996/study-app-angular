import {Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import { Test } from '../../objects/test';
import {MatDialog} from "@angular/material";
import {EditTestDialog} from "../../dialogs/editTest/edit-test.component";
import {isNullOrUndefined} from "util";
import {AddDialog} from "../../dialogs/addDialog/add-dialog";
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
  selector: 'app-test-manager',
  templateUrl: './test-manager.component.html',
  styleUrls: ['./test-manager.component.scss']
})
export class TestManagerComponent implements OnInit {

  tests: Test[];

  constructor( public dataEmit: DataEmitterService,
               private data: DataManagementService,
               private dialog: MatDialog,) {
    dataEmit.$updateArray.subscribe(data => {
      this.refreshData();
    });
  }

  ngOnInit() {
    this.refreshData();
  }

  addTest(): void{
    let dialogRef = this.dialog.open(AddDialog, { data: {name: '',} });
  }

  removeTest(test:any) {
    var body = { idtoken : localStorage.getItem('idtoken'), action: 'remove', testid:test._id/*, type: 'list'*/ };
    this.data.deleteDATA(global.url + '/api/tests/' + test._id, body).subscribe(dataResult=> { this.dataEmit.push(dataResult.message) });
  }

  editTest(test:any): void {
    let dialogRef = this.dialog.open(EditTestDialog, { width: '80%',  data: test });
    dialogRef.afterClosed().subscribe(() => {
      this.refreshData();
    });
  }

  refreshData() {
    this.data.getDATA(global.url + '/api/tests').subscribe(dataResult=> {
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

