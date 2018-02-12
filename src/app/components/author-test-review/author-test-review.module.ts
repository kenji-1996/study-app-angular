import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";
import {allocatedTest, newQuestion, submittedTest, submittedQuestion, newTest} from "../../objects/objects";
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
    selector: 'app-author-test-review',
    templateUrl: './author-test-review.component.html',
    styleUrls: ['./author-test-review.component.scss'],
    animations: [ fadeAnimate ],
})
export class AuthorTestReview implements OnInit, OnDestroy {

    constructor(
        private activeRoute: ActivatedRoute,
        private dataManagement: DataManagementService,
        private titleService: Title,
        private dataEmitter: DataEmitterService,
    ) { }
    allocatedTest: allocatedTest;
    test:newTest = new newTest('','',[],[]);
    subTest:submittedTest = new submittedTest();
    newSubTest:submittedTest = this.subTest;

    selectedId;
    answer;
    subscription;

    feedbackCount = 0;
    overallTestFeedback;

    onBroadcastAnswer(event) {
        if(this.feedbackCount === 0) { this.newSubTest.submittedQuestions = []; }
        this.newSubTest.submittedQuestions.push(event);
        this.feedbackCount++;
        if(this.feedbackCount >= this.subTest.submittedQuestions.length) {
             this.submitFeedback();
        }
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((params: Params) => {
            let testId = params['testId'];//usertest
            this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/submitlist').subscribe(allocatedTestResult => {
                console.log(allocatedTestResult);
                this.allocatedTest = allocatedTestResult.data;
                this.test = allocatedTestResult.data.test;
                this.subTest = allocatedTestResult.data.submittedTests[0];
                for(let i = 0; i < this.test.questions.length; i++) {
                    this.test.questions[i].feedback = this.subTest.submittedQuestions[i].feedback;
                    this.test.questions[i].mark = this.subTest.submittedQuestions[i].mark;
                    switch (this.test.questions[i].type) {
                        case "keywords":
                            this.test.questions[i].keywordsAnswer = this.subTest.submittedQuestions[i].keywordsAnswer;
                            break;
                        case "choices":
                            this.test.questions[i].choicesAnswer = this.subTest.submittedQuestions[i].choicesAnswer;
                            break;
                        case "arrangement":
                            this.test.questions[i].arrangement = this.subTest.submittedQuestions[i].arrangement;
                            //this.test.questions[i].possibleMarks = this.test.questions[i].arrangement.length;
                            break;
                        case "shortAnswer":
                            //this.test.questions[i].possibleMarks = 1;
                            this.test.questions[i].shortAnswer = this.subTest.submittedQuestions[i].shortAnswer;
                            break;
                        default://If no type is set, break
                        //return res.status(400).json({message: "Must provide type, 'keywords','choices','arrangement' and 'shortAnswer' are currently only accepted", data: req.body.questions});
                    }
                }
                this.overallTestFeedback = this.allocatedTest.feedback;
                this.titleService.setTitle('Mark tests - DigitalStudy');
            });
        });
    }

    submitFeedback() {
        this.newSubTest.test = this.allocatedTest._id;
        let body = { submittedTest: this.newSubTest, testFeedback: this.overallTestFeedback };
        this.dataManagement.postDATA(global.url + '/api/tests/' + this.test._id + '/submitList', body).subscribe(dataResult=> {
                if(dataResult) {
                    this.dataEmitter.pushUpdateArray(dataResult.message,'Test submitted','success');
                    //this.route.navigate(['/user/allocated-tests']);
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
    declarations: [AuthorTestReview],
    imports: [
        RouterModule.forChild([
            { path: '', component: AuthorTestReview, pathMatch: 'full'}
        ]),
        ImportsModule,
        SharedModule
    ]
})
export class AuthorTestModule {

}

