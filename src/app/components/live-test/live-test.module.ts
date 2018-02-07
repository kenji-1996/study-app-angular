import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";
import {allocatedTest, newQuestion, submittedTest, submittedQuestion} from "../../objects/objects";
import * as global from '../../globals';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import {Title} from "@angular/platform-browser";
import {DataEmitterService} from "../../services/data-emitter.service";
import {fadeAnimate} from "../../misc/animation";
import {KeywordQuestionComponent} from "../keyword-question/keyword-question.component";
import {ChoiceQuestionComponent} from "../choice-question/choice-question.component";
import {ArrangementComponent} from "../arrangement-question/arrangement-question.component";
import {ShortanswerQuestionComponent} from "../shortanswer-question/shortanswer-question.component";

@Component({
  selector: 'app-live-test',
  templateUrl: './live-test.component.html',
  styleUrls: ['./live-test.component.scss'],
  animations: [ fadeAnimate ],
})
export class LiveTestComponent implements OnInit, OnDestroy {

  constructor(
      private activeRoute: ActivatedRoute,
      private route: Router,
      private dataManagement: DataManagementService,
      private titleService: Title,
      private dataEmitter: DataEmitterService,
  ) { }
  allocatedTest: allocatedTest;
  selectedQuestion: newQuestion;
  submitTest: submittedTest = new submittedTest();
  progress = '0';

  selectedId;
  answer;
  timeLeft = 0;
  subscription;

  //Finished
  finished = false;

  //Options
  giveHint = false;
  timeLimit = false;
  fullPage = false;
  timerLimit = '30';
  randomOrder = false;//To-do1
  subscriber;

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(allocatedTestResult => {
        this.allocatedTest = allocatedTestResult.data;
        if(this.allocatedTest.test.fullPage) { this.fullPage = true; }
        if(this.allocatedTest.test.locked) {
          this.dataEmitter.pushUpdateArray('Cannot retrieve questions on locked test','Test locked','warning');
          this.route.navigate(['/user/tests']);
        }
          this.titleService.setTitle(this.allocatedTest.test.title + ' test - DigitalStudy');
          this.startTest();
      });
    });
    this.subscriber = this.dataEmitter.$testAnswer.subscribe(answer => {this.answer = answer; this.submitQuestion();});
  }

  private startTest() {
    this.submitTest.user = JSON.parse(localStorage.getItem('userObject'))._id;
    this.submitTest.test = this.allocatedTest.test._id;
    if(!this.selectedId) {
      this.selectedId = 0;
    }
    this.selectedQuestion = this.allocatedTest.test.questions[this.selectedId];
    this.testTimer();
  }

  private testTimer() {
    if(this.selectedQuestion && this.selectedQuestion.enableTimer && this.selectedQuestion.timer) {
      let timer = Observable.timer(0,100);
      let timeOver = this.selectedQuestion.timer; //parseInt(this.timerLimit);
      this.subscription = timer.subscribe(t=> {
        this.progress = ((t/timeOver * 10)).toFixed(2);
        if(t > (timeOver* 10)) {
          this.submitQuestion();
        }
      });
    }
  }

  public submitQuestion() {
    if(!this.answer && !this.selectedQuestion.enableTimer) {//On timer finish, dont give this message but submit empty string/result
      this.dataEmitter.pushUpdateArray('Please put an answer of sorts even if you are unsure!','Empty question','warning');
      return;
    }
    if(this.subscription) { this.subscription.unsubscribe(); }
    if(this.selectedId < this.allocatedTest.test.questions.length) {
      let submit = new submittedQuestion();
      submit.type = this.allocatedTest.test.questions[this.selectedId].type;
      submit._id = this.allocatedTest.test.questions[this.selectedId]._id;
      if(this.answer) {
        switch (submit.type) {
          case 'keywords':
            let stringArray = this.answer.split(/(\s+)/);
            submit.keywordsAnswer = stringArray;
            break;
          case 'choices':
            submit.choicesAnswer = this.answer;
            break;
          case 'arrangement':
            submit.arrangement = this.answer;
            break;
          case 'shortAnswer':
            submit.shortAnswer = this.answer;
            break;
        }
      }
      this.submitTest.submittedQuestions.push(submit);
      this.selectedId++;
      this.progress = '0';
      this.answer = '';
      this.selectedQuestion = this.allocatedTest.test.questions[this.selectedId];
      this.testTimer();
      if(!this.selectedQuestion) {
        this.testFinished();
      }

    }
  }

  testFinished() {
    let body = { submittedTest: this.submitTest, userTestId: this.allocatedTest._id };
    this.dataManagement.postDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/results', body).subscribe(dataResult=> {
      if(dataResult.message) { this.dataEmitter.pushUpdateArray(dataResult.message,'Test submitted','success'); }
    }, () => {  },
        () => {this.route.navigate(['/user/tests']);}
    );
  }



  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.submitQuestion();
    }
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

}


@NgModule({
  declarations: [LiveTestComponent,KeywordQuestionComponent, ChoiceQuestionComponent, ArrangementComponent, ShortanswerQuestionComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: LiveTestComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class LiveTestModule {

}

