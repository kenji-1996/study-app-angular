import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import { TableDataSource, ValidatorService } from 'angular4-material-table';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataManagementService} from "../../services/data-management.service";

import * as global from '../../globals';

@Injectable()
export class PersonValidatorService implements ValidatorService {
  getRowValidator(): FormGroup {
    return new FormGroup({
      'question': new FormControl(null, Validators.required),
      'answer': new FormControl(null, Validators.required),
      'category': new FormControl(),
    });
  }
}

@Component({
  selector: 'app-temp',
  providers: [
    {provide: ValidatorService, useClass: PersonValidatorService }
  ],
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.scss']
})
export class TempComponent implements OnInit {

  constructor(private personValidator: ValidatorService,
              private dataManagement: DataManagementService
  ) { }

  isSelected = false;
  selectedRow;
  rowGroup = [];

  @Input() questionList = [];

  displayedColumns = ['question', 'answer', 'category'];
  @Output() questionListChange = new EventEmitter<Question[]>();

  dataSource: TableDataSource<Question>;

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
    console.log(this.dataSource);
    var body = { idtoken : localStorage.getItem('idtoken'), action: 'update', testid:'5a4d983d3e56e023041988c1', questions: this.dataSource.currentData /*this.data._id, type: 'list'*/ };
    this.dataManagement.postDATA(global.url + '/api/question', body).subscribe(dataResult=> {
      console.log(dataResult);
    });
  }


  ngOnInit() {
    var body = { idtoken : localStorage.getItem('idtoken'), action: 'get', testid:'5a4d983d3e56e023041988c1' /*this.data._id, type: 'list'*/ };
    this.dataManagement.postDATA(global.url + '/api/question', body).subscribe(dataResult=> {
      this.questionList = dataResult;
      this.dataSource = new TableDataSource<any>(this.questionList, Question, this.personValidator);
      this.dataSource.datasourceSubject.subscribe(questionList => this.questionListChange.emit(questionList));
    });
  }


}

class Question {
  question: string;
  answer: string;
  category: string;
}