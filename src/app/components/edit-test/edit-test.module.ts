import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {Question, TestToQuestion} from "../../objects/objects";
import {EditTestNameDialog} from "../../dialogs/editTestName/edit-test-name";
import {MatDialog} from "@angular/material";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {EditQuestionDialog} from "../../dialogs/editQuestion/edit-question";
import {isNullOrUndefined} from "util";
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.scss']
})
export class EditTestComponent implements OnInit {

  test;
  selectedQuestion;

  constructor(private route: ActivatedRoute,
              private dataManagement: DataManagementService,
              private dialog: MatDialog,
              public dataEmit: DataEmitterService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(dataResult=> {
        console.log(dataResult.data);
        var questions:Array<Question> = [];
        let test = new TestToQuestion(dataResult.data[0]._id,dataResult.data[0].title,questions,dataResult.data[0].author);
        this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/questions').subscribe(dataResult=> {
          for(var i = 0; i < dataResult.data.length; i++) {
            questions.push(new Question(dataResult.data[i]._id,dataResult.data[i].question,dataResult.data[i].answer,dataResult.data[i].category,dataResult.data[i].hint,dataResult.data[i].keywords));
          }
          this.test = test;
        });
      });
    });
  }

  removeTest() {
    const index: number = this.test.questions.indexOf(this.selectedQuestion);
    if (index !== -1) {
      this.test.questions.splice(index, 1);
    }
  }

  selectQuestion(selected:any) {
    this.selectedQuestion = selected;
  }

  updateTest() {
    let dialogRef = this.dialog.open(EditTestNameDialog, { data: this.test});
  }

  submitQuestions() {
    var body = { questions: this.test.questions  };
    this.dataManagement.postDATA(global.url + '/api/tests/' + this.test._id + '/questions', body).subscribe(dataResult=> {
      if(dataResult) {
        this.dataEmit.pushUpdateArray(dataResult.message);
      }
    });
  }

  upsertQuestion() {
    let dialogRef = this.dialog.open(EditQuestionDialog, { width: '100%', data: (this.selectedQuestion? this.selectedQuestion : new Question('','','','','',[]))});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(this.selectedQuestion) {
          this.selectedQuestion = result;

        }else{
          this.test.questions.push(result);
        }
        this.selectedQuestion = null;
      }
    });
  }

}
@NgModule({
  declarations: [EditTestComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: EditTestComponent, pathMatch: 'full'}
    ]),
    ImportsModule,
    InfiniteScrollModule
  ]
})
export class EditTestModule {

}
