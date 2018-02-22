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
import {SharedModule} from "../../modules/shared.module";

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
    submitted = false;

    selectedId;
    answer;
    timeLeft = 0;
    subscription;

    //Finished
    submitAll = false;

    onBroadcastAnswer(answer:any) {
        console.log(answer);
        this.submitQuestion(answer.question, answer.answer);
        if(this.submitTest.submittedQuestions.length === this.allocatedTest.test.questions.length) {
            this.submitted = true;
            this.testFinished();
        }
    }

    onBack(event:any) {
        console.log('attempting to back');
        this.selectedId--;
    }

    onNext(event:any) {
        this.selectedId++;
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((params: Params) => {
            let testId = params['testId'];
            this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(allocatedTestResult => {
                this.allocatedTest = allocatedTestResult.data;
                if(this.allocatedTest.test.locked) {
                    this.dataEmitter.pushUpdateArray('Cannot retrieve questions on locked test','Test locked','warning');
                    this.route.navigate(['/app/user/tests']);
                }
                console.log(this.allocatedTest);
                this.titleService.setTitle(this.allocatedTest.test.title + ' test - DigitalStudy');
                this.submitTest.user = JSON.parse(localStorage.getItem('userObject'))._id;
                this.submitTest.test = this.allocatedTest.test._id;
                this.startTest();
            });
        });
    }

    private startTest() {
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
                    this.submitQuestion(this.selectedQuestion,this.answer);
                }
            });
        }
    }

    public submitQuestion(question: newQuestion, answer: any) {
        let submit = new submittedQuestion();
        submit.type = question.type;
        submit._id = question._id;
        if(answer) {
            switch (submit.type) {
                case 'keywords':
                    let stringArray = answer.split(/(\s+)/);
                    submit.keywordsAnswer = stringArray;
                    break;
                case 'choices':
                    submit.choicesAnswer = answer;
                    break;
                case 'arrangement':
                    submit.arrangement = answer;
                    break;
                case 'shortAnswer':
                    submit.shortAnswer = answer;
                    break;
            }
        }
        this.submitTest.submittedQuestions.push(submit);
        /*if(!this.allocatedTest.test.fullPage) {
            if(answer) {
                switch (question.type) {
                    case 'keywords':
                        let stringArray = answer.split(/(\s+)/);
                        question.keywordsAnswer = stringArray;
                        break;
                    case 'choices':
                        question.choicesAnswer = answer;
                        break;
                    case 'arrangement':
                        question.arrangement = answer;
                        break;
                    case 'shortAnswer':
                        question.shortAnswer = answer;
                        break;
                }
            }
            if(this.subscription) { this.subscription.unsubscribe(); }
            this.progress = '0';
            this.answer = '';
            this.selectedId++;
            this.selectedQuestion = this.allocatedTest.test.questions[this.selectedId];
            this.testTimer();
        }*/
    }

    testFinished() {
        let body = { submittedTest: this.submitTest, userTestId: this.allocatedTest._id };
        this.dataManagement.postDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/tests/allocated', body).subscribe(dataResult=> {
                if(dataResult) {
                    this.dataEmitter.pushUpdateArray(dataResult.message,'Test submitted','success');
                    this.route.navigate(['/app/user/allocated-tests']);
                }
            }
        );
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
        ImportsModule,
        SharedModule
    ]
})
export class LiveTestModule {

}

