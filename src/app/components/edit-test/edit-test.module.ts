import {Component, NgModule, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {Question, TestToQuestion} from "../../objects/objects";
import {EditTestNameDialog} from "../../dialogs/editTestName/edit-test-name";
import {MatDialog} from "@angular/material";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {EditQuestionDialog} from "../../dialogs/editQuestion/edit-question";
import {DataEmitterService} from "../../services/data-emitter.service";
import {Title} from "@angular/platform-browser";
import {DialogsService} from "../../services/dialogs.service";
import {ConfirmChangesGuard} from "../../guards/confirm-changes.guard";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.scss']
})
export class EditTestComponent implements OnInit  {
  @Input('search') searchString: string;
  dirty: boolean;
  test;
  query;

  constructor(private route: ActivatedRoute,
              private dataManagement: DataManagementService,
              private dialog: MatDialog,
              public dataEmit: DataEmitterService,
              private titleService: Title,
              private dialogsService: DialogsService,
  ) { }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.dirty) {
      return true;
    }
    return this.dialogsService.confirm('Unsaved test', 'You have unsaved changes, are you sure you want to leave this page?');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(dataResult=> {
        var questions:Array<Question> = [];
        let test = new TestToQuestion(dataResult.data._id,dataResult.data.title,questions,dataResult.data.author);
        this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/questions').subscribe(dataResult=> {
          for(var i = 0; i < dataResult.data.length; i++) {
            questions.push(new Question(dataResult.data[i]._id,dataResult.data[i].question,dataResult.data[i].answer,dataResult.data[i].category,dataResult.data[i].hint,dataResult.data[i].keywords));
          }
          this.test = test;
          this.titleService.setTitle(this.test.title + ' test edit - DigitalStudy');
        });
      });
    });
  }

  confirmRemoveTest(test:any) {
    this.removeTest(test);
    if(this.dialogsService.confirm('Remove question', 'Are you sure you want to remove this question?')) {

    };
  }

  removeTest(test:any) {
    console.log(this.test.questions);
    const index: number = this.test.questions.indexOf(test);
    if (index !== -1) {
      this.test.questions.splice(index, 1);
    }
    console.log(this.test.questions);
    this.dataEmit.pushDirty(true);
  }

  updateTest() {
    this.dataEmit.pushDirty(true);
    let dialogRef = this.dialog.open(EditTestNameDialog, { data: this.test});
  }

  submitQuestions() {
    this.dirty = false;
    var body = { questions: this.test.questions  };
    this.dataManagement.postDATA(global.url + '/api/tests/' + this.test._id + '/questions', body).subscribe(dataResult=> {
      if(dataResult) {
        this.dataEmit.pushDirty(false);
       // this.dataEmit.pushUpdateArray(dataResult.message);
      }
    });
  }

  upsertQuestion(question:any) {
    this.dataEmit.pushDirty(true);
    let dialogRef = this.dialog.open(EditQuestionDialog, { width: '100%', data: (question? question : new Question('','','','','',[]))});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        if(question) {
          this.removeTest(question);
        }
        this.test.questions.push(result);
      }
    });
  }

}
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: '', component: EditTestComponent, pathMatch: 'full', canDeactivate: [ConfirmChangesGuard] }
    ]),
    ImportsModule,
    InfiniteScrollModule
  ],
  providers: [
      ConfirmChangesGuard,
  ]
})
export class EditTestModule {

}
