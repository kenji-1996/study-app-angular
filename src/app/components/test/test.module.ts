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
import {DataEmitterService} from "../../services/data-emitter.service";
import {Title} from "@angular/platform-browser";

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
  timerMax = '30';
  selectedQuestion;
  selectedId = 0;
  answer;
  timeLeft = 0;

  //Finished
  finished = false;
  percentResult;
  totalKeywords = 0;
  givenKeywords = 0;

  //Options
  giveHint = false;
  timeLimit = false;
  instantResult = false;
  randomOrder = false;

  private subscription: Subscription;
  constructor(
      private route: ActivatedRoute,
      private dataManagement: DataManagementService,
      private dataEmitter: DataEmitterService,
      private titleService: Title,
  ) { }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(dataResult=> {
        var questions:Array<Question> = [];
        let test = new TestToQuestion(dataResult.data[0]._id,dataResult.data[0].title,questions,dataResult.data[0].author);
        this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/questions').subscribe(dataResult=> {
          for(var i = 0; i < dataResult.data.length; i++) {
            questions.push(new Question(dataResult.data[i]._id,dataResult.data[i].question,dataResult.data[i].answer,dataResult.data[i].category,dataResult.data[i].hint,dataResult.data[i].keywords));
          }
          this.test$ = Observable.of(test);
          this.test = test;
          this.titleService.setTitle(this.test.title + ' - DigitalStudy');
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
    let timer = Observable.timer(0,100);
    let timeOver = parseInt(this.timerMax);
    this.subscription = timer.subscribe(t=> {
      this.progress = ((t/timeOver * 10)).toFixed(2);
      if(t > (timeOver* 10)) {
        this.submitQuestion();
      }
    });
  }

  private submitQuestion() {
    if(!this.answer) {
      this.dataEmitter.pushUpdateArray('Please put an answer of sort sort even if you are unsure!');
      return;
    }
    if(this.subscription) { this.subscription.unsubscribe(); }
    if(this.selectedId < this.test.questions.length) {
      this.selectedId++;
      var markCount = this.checkAnswer();
      var percentResult = ((markCount/this.selectedQuestion.keywords.length * 100));
      this.result.push(new testQuestion(this.selectedQuestion._id, this.selectedQuestion.question, this.selectedQuestion.answer, this.selectedQuestion.category, this.answer, (this.timeLimit ? this.timeLeft : 0),percentResult, markCount));
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
    this.finished = true;
    this.started = false;
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

