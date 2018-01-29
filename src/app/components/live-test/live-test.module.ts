import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";
import {allocatedTest, newQuestion, Question, Result, TestToQuestion} from "../../objects/objects";
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
import {ShortanswerQuestionComponent} from "../../component/shortanswer-question/shortanswer-question.component";

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

  /**
   * 'test' - Holds the test information and questions loaded from database\
   * 'result' - Array that holds the result, gets added to as the rest is taken
   * 'progress' - The progress the visual timer has as its incremented, used as global so it can be accessed when the question is over and to reset.
   * 'selectedQuestion' - The current question the home is attempting. (Identified by 'selectedId')
   * 'answer' - Binded to the 'answer' textarea input field, gets submitted if there is anything in it.
   * 'timeLeft' - The amount of time a question has left when the home is submitting an answer on a timed basis.
   */
  allocatedTest: allocatedTest;
  selectedQuestion: newQuestion;
  //Result is now caluclated server side.
  //result:Result[] = [];
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
  instantResult = false;
  randomOrder = false;//To-do1
  subscriber;

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      //Subscribe to the route and get params passed in
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(allocatedTestResult => {
        this.allocatedTest = allocatedTestResult.data;
        console.log(this.allocatedTest);
        if(this.allocatedTest.test.fullPage) { this.fullPage = true; }
        if(this.allocatedTest.test.instantResult) { this.instantResult = true; }
          this.titleService.setTitle(this.allocatedTest.test.title + ' test - DigitalStudy');
          console.log(this.allocatedTest);
          this.startTest();
      });
    });
    this.subscriber = this.dataEmitter.$testAnswer.subscribe(answer => {this.answer = answer; this.submitQuestion(); console.log(answer);});
  }

  private startTest() {

    if(!this.selectedId) {
      this.selectedId = 0;
    }
    this.selectedQuestion = this.allocatedTest.test.questions[this.selectedId];
    if(this.timeLimit) {
      this.testTimer();
    }
  }

  private testTimer() {
    let timer = Observable.timer(0,100);
    let timeOver = parseInt(this.timerLimit);
    this.subscription = timer.subscribe(t=> {
      this.progress = ((t/timeOver * 10)).toFixed(2);
      if(t > (timeOver* 10)) {
        this.submitQuestion();
      }
    });
  }

  public submitQuestion() {
    if(!this.answer) {//On timer finish, dont give this message but submit empty string/result
      this.dataEmitter.pushUpdateArray('Please put an answer of sorts even if you are unsure!');
      return;
    }
    if(this.subscription) { this.subscription.unsubscribe(); }
    if(this.selectedId < this.allocatedTest.test.questions.length) {
      this.selectedId++;
      this.progress = '0';
      this.answer = '';
      this.selectedQuestion = this.allocatedTest.test.questions[this.selectedId];
      if(!this.selectedQuestion) {
        this.testFinished();
      }
      if (this.timeLimit) {
        this.testTimer();
      }
    }
  }

  checkAnswer() {
    /*var xd = this.answer.match(/\b(\w+)\b/g);
    var inputSorted = [];
    if(xd) {
      for (var i = 0; i < xd.length; i++) {
        inputSorted.push(xd[i].toLowerCase());
      }
      inputSorted.sort();
    }
    var answerSorted = [];
    if(this.selectedQuestion.keywords) {
      for (var i = 0; i < this.selectedQuestion.keywords.length; i++) {
        answerSorted.push(this.selectedQuestion.keywords[i].toLowerCase());
      }
      answerSorted.sort();
    }
    return this.intersect_safe(answerSorted,inputSorted);*/
  }

  intersect_safe(a, b) {
    var ai=0, bi=0;
    var result = [];

    while( ai < a.length && bi < b.length )
    {
      if      (a[ai] < b[bi] ){ ai++; }
      else if (a[ai] > b[bi] ){ bi++; }
      else /* they're equal */
      {
        result.push(a[ai]);
        ai++;
        bi++;
      }
    }
    return result.length;
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.submitQuestion();
    }
  }

  testFinished() {
    /*var answerTotal = 0;
    for(var i = 0; i < this.test.questions.length; i++) {
      answerTotal+= this.test.questions[i].keywords.length;
    }
    var markTotal = 0;
    for( var i = 0; i < this.result.length; i++ ){
      markTotal += this.result[i].markCount; //don't forget to add the base
    }
    var avg = ((markTotal/answerTotal) * 100).toFixed(1);
    this.totalKeywords = answerTotal;
    this.givenKeywords = markTotal;
    this.percentResult = avg;

    //Submit question to database
    let questionToResult = [];
    for(let i = 0; i < this.result.length; i++) {
      questionToResult.push({_id:this.result[i]._id,mark:this.result[i].markCount + '/' + this.test.questions[i].keywords.length})
    }
    let postTestData = [];
    postTestData.push({result: this.result, test:this.test,percentResult: this.percentResult,mark: this.givenKeywords + '/' + this.totalKeywords});
    localStorage.setItem('result',JSON.stringify(postTestData));
    this.route.navigate(['tests/result', this.test._id]);
    var body = {
      testId: this.test._id,
      testTitle: this.test.title,
      questionsToResult: questionToResult,
      mark: this.givenKeywords + '/' + this.totalKeywords,
      percent: parseInt(this.percentResult),
      private: false,
    };
    this.dataManagement.postDATA(global.url + '/api/results', body).subscribe(dataResult => {
      this.dataEmitter.pushUpdateArray(dataResult.message);
    });*/
    alert('server has not yet implimented backend question marking');
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

