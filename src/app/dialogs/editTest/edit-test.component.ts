import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, EventEmitter, Inject, Injectable, Input, Output} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import {TableDataSource, ValidatorService} from "angular4-material-table";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Injectable()
export class QuestionValidationService implements ValidatorService {
    getRowValidator(): FormGroup {
        return new FormGroup({
            'question': new FormControl(null, Validators.required),
            'answer': new FormControl(null, Validators.required),
            'category': new FormControl(),
        });
    }
}

@Component({
    selector: 'edit-test',
    providers: [
        {provide: ValidatorService, useClass: QuestionValidationService }
    ],
    templateUrl: './edit-test.html',
})
export class EditTestDialog {

    isSelected = false;
    selectedRow;

    @Input() questionList = [];

    displayedColumns = ['question', 'answer', 'category'];
    @Output() questionListChange = new EventEmitter<Question[]>();

    dataSource: TableDataSource<Question>;

    constructor(
        public dialogRef: MatDialogRef<EditTestDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private personValidator: ValidatorService,
        private dataManagement: DataManagementService,
    ) {
        var body = { idtoken : localStorage.getItem('idtoken'), action: 'get', testid:data._id /*this.data._id, type: 'list'*/ };
        this.dataManagement.postDATA(global.url + '/api/question', body).subscribe(dataResult=> {
            this.questionList = dataResult.data;
            this.dataSource = new TableDataSource<any>(this.questionList, Question, this.personValidator);
            this.dataSource.datasourceSubject.subscribe(questionList => this.questionListChange.emit(questionList));
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    selectAndEditRow(row:any) {
        if(!this.selectedRow) {
            this.selectedRow = row;
            this.isSelected = true;
            row.startEdit();
        }
    }

    confirmSelectedRow() {
        this.selectedRow.confirmEditCreate();
        this.isSelected = false;
        this.selectedRow.editing = false;
        this.selectedRow = null;
    }

    cancelOrDeleteRow() {
        this.selectedRow.delete();
        this.selectedRow.editing = false;
        this.isSelected = false;
    }

    submitArray() {
        var body = { idtoken : localStorage.getItem('idtoken'), action: 'update', testid:this.data._id, questions: this.dataSource.currentData /*this.data._id, type: 'list'*/ };
        this.dataManagement.postDATA(global.url + '/api/question', body).subscribe(dataResult=> {
            console.log(dataResult);
        });
    }
}

class Question {
    question: string;
    answer: string;
    category: string;
}