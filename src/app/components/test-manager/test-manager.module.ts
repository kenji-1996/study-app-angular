import {Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import { Test } from '../../objects/test';
import {MatDialog} from "@angular/material";
import {EditTestDialog} from "../../dialogs/editTest/edit-test.component";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-test-manager',
  templateUrl: './test-manager.component.html',
  styleUrls: ['./test-manager.component.scss']
})
export class TestManagerComponent implements OnInit {

  tests: Test[];
  selectedTest: Test;

  constructor( private route: Router,
               private data: DataManagementService,
               private dialog: MatDialog,) { }

  ngOnInit() {
    var body = { idtoken : localStorage.getItem('idtoken'), action: 'get'/*, type: 'list'*/ };
    this.data.postDATA(global.url + '/api/test', body).subscribe(dataResult=> {
      this.tests = dataResult;
    });
  }

  onSelect(test:Test) {
    this.selectedTest = test;
  }

  editTest(): void {
    let dialogRef = this.dialog.open(EditTestDialog, {
      width: '80%',
      data: this.selectedTest
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!isNullOrUndefined(result)) {
        alert(result);
        //this.userService.update(this.id_token,this.name, this.profileImage).subscribe(result => console.log(result));
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
    ImportsModule
  ]
})
export class TestManagerModule {

}

