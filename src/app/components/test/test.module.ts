import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {Observable} from "rxjs/Observable";
import {Question, TestToQuestion} from "../../objects/objects";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import * as global from '../../globals';
import {DataManagementService} from "../../services/data-management.service";
import {Subscription} from "rxjs/Subscription";
import {DataEmitterService} from "../../services/data-emitter.service";
import {Title} from "@angular/platform-browser";
import {fadeAnimate} from "../../misc/animation";
import {SearchPipe} from "../../pipes/search.pipe";
import {EditTestComponent} from "../edit-test/edit-test.module";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {DialogsService} from "../../services/dialogs.service";
import {ConfirmChangesGuard} from "../../guards/confirm-changes.guard";
import {NgbCheckBox} from "@ng-bootstrap/ng-bootstrap";
import {NbCheckboxModule} from "@nebular/theme";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [ fadeAnimate ],
})
export class TestComponent implements OnInit {


  //Test variables
  test$: Observable<TestToQuestion>;
  test;
  started = false;
  progress = '0';
  timerMax = '30';
  selectedQuestion;
  selectedId = 0;
  answer;
  timeLeft = 0;
  query;

  //Test options
  giveHint = false;
  timeLimit = false;
  instantResult = false;
  randomOrder = false;//To-do1

  //Format
  isCollapsed = true;
  databaseResult;
  dirty: boolean;

  //Recent results
  private subscription: Subscription;
  constructor(
      private activeRoute: ActivatedRoute,
      private route: Router,
      private dataManagement: DataManagementService,
      private databaseManagementService: DataManagementService,
      public dataEmitter: DataEmitterService,
      private titleService: Title,
      private dialogsService: DialogsService,
  ) { }

  ngOnInit() {

    this.activeRoute.params.subscribe((params: Params) => {
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(dataResult=> {
        var questions:Array<Question> = [];
        console.log(dataResult);
        let test = new TestToQuestion(dataResult.data._id,dataResult.data.title,questions,'');
        this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/questions').subscribe(dataResult=> {
          for(var i = 0; i < dataResult.data.length; i++) {
            questions.push(new Question(dataResult.data[i]._id,dataResult.data[i].question,dataResult.data[i].answer,dataResult.data[i].category,dataResult.data[i].hint,dataResult.data[i].keywords));
          }
          this.test$ = Observable.of(test);
          this.test = test;
          if(this.test) {
            this.populateResults();
          }
          this.titleService.setTitle(this.test.title + ' test - DigitalStudy');
        });
      });
    });
    this.dataEmitter.$dirty.subscribe(dirty=>this.dirty = dirty);
  }


  canDeactivate(): Observable<boolean> | boolean {
    if (!this.dirty) {
      return true;
    }
    return this.dialogsService.confirm('Unsaved test', 'You have unsaved changes, are you sure you want to leave this page?');
  }

  testStarted() {
    this.route.navigate( ['tests/live', this.test._id], {queryParams: { giveHint:this.giveHint,timeLimit: this.timeLimit? this.timerMax : 0,instantResult: this.instantResult,questionId:this.selectedId }});
  }

  populateResults() {
    this.dataManagement.getDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/results/' + this.test._id).subscribe(dataResult=> {
      if(!this.isEmptyObject(dataResult.data)) {
        this.databaseResult = dataResult.data;
      }
    });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  setMyClasses(result:any) {
    let percent = parseInt(result);
    let styles;
    switch (true)
    {
      case percent <= 30:
        styles = {

          'color': 'red',
        };
        return 'btn  btn-block btn-hero-danger';
      case percent <= 60:
        styles = {

          'color': 'orange',
        };
        return 'btn  btn-block btn-hero-warning';
      case percent <= 80:
        styles = {

          'color': 'yellow',
        };
        return 'btn  btn-block btn-hero-info';
      case percent > 80:
        styles = {
          'color': 'green',
        };
        return 'btn  btn-block btn-hero-success';
      default:
    }
  }

  setMyStyles(result:any) {
    let percent = parseInt(result);
    let styles;
    switch (true)
    {
      case percent <= 30:
        styles = {

          'color': 'red',
        };
        return styles;
      case percent <= 60:
        styles = {

          'color': 'orange',
        };
        return styles;
      case percent <= 80:
        styles = {

          'color': 'yellow',
        };
        return styles;
      case percent > 80:
        styles = {
          'color': 'green',
        };
        return styles;
      default:
    }

  }


}
@NgModule({
  declarations: [
    TestComponent,
    SearchPipe,
    EditTestComponent,
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: TestComponent, pathMatch: 'full', canDeactivate: [ConfirmChangesGuard]}
    ]),
    ImportsModule,
    InfiniteScrollModule,
    NbCheckboxModule,
  ],
  providers: [
    ConfirmChangesGuard,
  ]
})
export class TestModule {

}

