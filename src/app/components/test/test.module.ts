import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {Observable} from "rxjs/Observable";
import {Question, testQuestion, TestToQuestion} from "../../objects/objects";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import * as global from '../../globals';
import {DataManagementService} from "../../services/data-management.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  //Loaded in test
  test$: Observable<TestToQuestion>;
  result:testQuestion[] = [];
  test;
  started = false;
  progress = '0';
  selectedQuestion;
  selectedId = 0;
  answer;
  timeLeft = 0;

  //Options
  giveHint = false;
  timeLimit = false;
  instantResult = false;
  randomOrder = false;

  private subscription: Subscription;
  constructor(
      private route: ActivatedRoute,
      private dataManagement: DataManagementService
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
          this.test$ = Observable.of(test);
          this.test = test;
        });
      });
    });
  }

  testStarted() {
    this.started = true;
    if(this.timeLimit) {
      this.testTimer();
    }
    if(!this.randomOrder) {
      this.selectedQuestion = this.test.questions[this.selectedId];
    }
  }

  private testTimer() {
    let timer = Observable.timer(0,1000);
    let timeOver = 10;
    this.subscription = timer.subscribe(t=> {
      this.progress = ((t/timeOver)*100).toFixed(2);
      if(t > timeOver) {
        this.submitQuestion();
      }
    });
  }

  private submitQuestion() {
    if(this.subscription) { this.subscription.unsubscribe(); }
    if(this.selectedId < this.test.questions.length) {
      this.selectedId++;
      this.result.push(new testQuestion(this.selectedQuestion._id,this.selectedQuestion.question,this.selectedQuestion.answer,this.selectedQuestion.category,this.answer,(this.timeLimit? this.timeLeft : 0),0));
      this.progress = '0';
      this.selectedQuestion = this.test.questions[this.selectedId];
      this.testTimer();
    }
  }

  checkAnswer() {

  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
@NgModule({
  declarations: [TestComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: TestComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class TestModule {

}

