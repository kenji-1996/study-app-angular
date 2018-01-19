import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";
import {Question, Result, TestToQuestion} from "../../objects/objects";
import * as global from '../../globals';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import {Title} from "@angular/platform-browser";
import {DataEmitterService} from "../../services/data-emitter.service";
import {fadeAnimate} from "../../misc/animation";

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
  test;
  result:Result[] = [];
  progress = '0';
  selectedQuestion;
  selectedId;
  answer;
  timeLeft = 0;
  subscription;

  //Finished
  finished = false;
  percentResult;
  totalKeywords = 0;
  givenKeywords = 0;

  //Options
  giveHint = false;
  timeLimit = false;
  timerLimit = '30';
  instantResult = false;
  randomOrder = false;//To-do1

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      //Subscribe to the route and get params passed in
      let testId = params['testId'];
      this.giveHint = (this.activeRoute.snapshot.queryParamMap.get('giveHint') == 'true');
      if(parseInt(this.activeRoute.snapshot.queryParamMap.get('timeLimit')) > 0) {
        this.timeLimit = true;
        this.timerLimit = this.activeRoute.snapshot.queryParamMap.get('timeLimit') + '';
      }
      this.instantResult = (this.activeRoute.snapshot.queryParamMap.get('instantResult') == 'true');
      if(this.activeRoute.snapshot.queryParamMap.get('questionId')) {
        this.selectedId = parseInt(this.activeRoute.snapshot.queryParamMap.get('questionId'));
      }
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(dataResult=> {
        var questions:Array<Question> = [];
        let test = new TestToQuestion(dataResult.data[0]._id,dataResult.data[0].title,questions,dataResult.data[0].author);
        this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/questions').subscribe(dataResult=> {
          for(var i = 0; i < dataResult.data.length; i++) {
            questions.push(new Question(dataResult.data[i]._id,dataResult.data[i].question,dataResult.data[i].answer,dataResult.data[i].category,dataResult.data[i].hint,dataResult.data[i].keywords));
          }
          this.test = test;
          this.startTest();
          this.titleService.setTitle(this.test.title + ' live test - DigitalStudy');
        });
      });
    });
  }

  private startTest() {
    if(!this.selectedId) {
      this.selectedId = 0;
    }
    this.selectedQuestion = this.test.questions[this.selectedId];
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
    if(!this.answer) {
      this.dataEmitter.pushUpdateArray('Please put an answer of sort sort even if you are unsure!');
      return;
    }
    if(this.subscription) { this.subscription.unsubscribe(); }
    if(this.selectedId < this.test.questions.length) {
      this.selectedId++;
      var markCount = this.checkAnswer();
      var percentResult = ((markCount/this.selectedQuestion.keywords.length * 100));
      this.result.push(new Result(this.selectedQuestion._id, this.selectedQuestion.question, this.selectedQuestion.answer, this.selectedQuestion.category, this.answer, (this.timeLimit ? this.timeLeft : 0),percentResult, markCount));
      if (this.instantResult) {
        this.dataEmitter.pushUpdateArray('Percentage answer result: ' + percentResult + '%')
      }
      this.progress = '0';
      this.answer = '';
      this.selectedQuestion = this.test.questions[this.selectedId];
      if(!this.selectedQuestion) {
        this.testFinished();
      }
      if (this.timeLimit) {
        this.testTimer();
      }
    }
  }

  checkAnswer() {
    var xd = this.answer.match(/\b(\w+)\b/g);
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
    return this.intersect_safe(answerSorted,inputSorted);
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
    var answerTotal = 0;
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
    });
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}


@NgModule({
  declarations: [LiveTestComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: LiveTestComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class LiveTestModule {

}

