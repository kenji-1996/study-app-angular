import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from "@angular/material";
import {Component, Inject} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';

@Component({
    selector: 'edit-test',
    templateUrl: './edit-test.html',
})
export class EditTestDialog {

    questions;
    displayedColumns = ['question', 'answer', 'category'];
    question:any;
    dataSource;

    constructor(
        public dialogRef: MatDialogRef<EditTestDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataManagement: DataManagementService,
    ) {
        var body = { idtoken : localStorage.getItem('idtoken'), action: 'get', testid: this.data._id/*, type: 'list'*/ };
        this.dataManagement.postDATA(global.url + '/api/question', body).subscribe(dataResult=> {
            this.dataSource = new MatTableDataSource<any>(dataResult);
            console.log(this.questions);
        });
    }
    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }
}

export interface question {
    question: string;
    answer: number;
    category: string;
}
