import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, EventEmitter, Inject, Injectable, Input, Output} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';
import {TableDataSource, ValidatorService} from "angular4-material-table";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataEmitterService} from "../../services/data-emitter.service";

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
    providers: [ {provide: ValidatorService, useClass: QuestionValidationService } ],
    templateUrl: './edit-test.html',
    styleUrls: ['./edit-test.scss']
})
export class EditTestDialog {

    isSelected = false;
    selectedRow;

    @Input() questionList = [];

    displayedColumns = ['question', 'answer', 'category', 'hint', 'keywords'];
    @Output() questionListChange = new EventEmitter<Question[]>();

    public dataSource: TableDataSource<Question>;

    constructor(
        public dialogRef: MatDialogRef<EditTestDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private personValidator: ValidatorService,
        private dataManagement: DataManagementService,
        public dataEmit: DataEmitterService
    ) {
        this.dataManagement.getDATA(global.url + '/api/tests/' + data._id + '/questions').subscribe(dataResult=> {
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
        /*let questions;
        if(this.dataSource.currentData) {
            questions = this.dataSource.currentData
        }else{
            questions = this.questionList;
        }
        var body = { questions: questions  };
        this.dataManagement.postDATA(global.url + '/api/tests/' + this.data._id + '/questions', body).subscribe(dataResult=> {
            if(dataResult) {
                this.dialogRef.close();
                this.dataEmit.pushUpdateArray(dataResult.message);
            }
        });*/
    }
}

class Question {
    question: string;
    answer: string;
    category: string;
}
