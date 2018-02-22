import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {DataManagementService} from "../../services/data-management.service";
import {allocatedTest, newTest} from "../../objects/objects";
import * as global from '../../globals';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import {Title} from "@angular/platform-browser";
import {DataEmitterService} from "../../services/data-emitter.service";
import {fadeAnimate} from "../../misc/animation";
import {SharedModule} from "../../modules/shared.module";
import {isNull, isNullOrUndefined} from "util";

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
    subTest: Array<any> = [];
    questionResults = [];

    selectedId;
    answer;
    subscription;
    pickedId = null;

    overallTestFeedback;
    submitAll = false;

    onSubmit() {
        if(this.pickedId == null) {
            this.submitFeedback();
        }else{
            this.submitAll = true;
        }
    }

    onBroadcastAnswer(event) {
        console.log(event);
        this.questionResults.push(event);
        if (this.questionResults.length >= this.allocatedTest.test.questions.length) {
            this.submitAll = false;
            let loop = 0;
            let valid = true;
            for(let i = 0; i < this.questionResults.length; i++) {
                loop++;
                if(this.questionResults[i].mark === isNullOrUndefined) {
                    console.log(this.questionResults[i].mark);
                    valid = false;
                }
            }
            if(loop >= this.questionResults.length && valid) {
                this.submitFeedback();
                this.questionResults = [];
            }else{
                alert('Marks required if you wish to submit test feedback');
                this.questionResults = [];
            }
            //this.handleEvents(this.questionResults.submittedQuestions);
        }
    }

    setSubTest(sub:any) {
        this.pickedId = sub;
        this.subTest = this.allocatedTest.submittedTests[sub];
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((params: Params) => {
            let testId = params['testId'];//usertest
            this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/submitlist').subscribe(allocatedTestResult => {
                console.log(allocatedTestResult.data);
                this.allocatedTest = allocatedTestResult.data;
                this.test = allocatedTestResult.data.test;
                this.overallTestFeedback = this.allocatedTest.feedback;
                for(let j = 0; j < this.allocatedTest.submittedTests.length;j++) {
                    let subTest = this.allocatedTest.submittedTests[j];
                    for (let i = 0; i < this.test.questions.length; i++) {
                        this.test.questions[i].feedback = subTest.submittedQuestions[i].feedback;
                        this.test.questions[i].mark = subTest.submittedQuestions[i].mark;
                        switch (this.test.questions[i].type) {
                            case "keywords":
                                this.test.questions[i]['submittedAnswer'] = subTest.submittedQuestions[i].keywordsAnswer;
                                break;
                            case "choices":
                                this.test.questions[i]['submittedAnswer'] = subTest.submittedQuestions[i].choicesAnswer;
                                break;
                            case "arrangement":
                                this.test.questions[i]['submittedAnswer'] = subTest.submittedQuestions[i].arrangement;
                                //this.test.questions[i].possibleMarks = this.test.questions[i].arrangement.length;
                                break;
                            case "shortAnswer":
                                //this.test.questions[i].possibleMarks = 1;
                                this.test.questions[i]['submittedAnswer'] = subTest.submittedQuestions[i].shortAnswer;
                                break;
                            default://If no type is set, break
                            //return res.status(400).json({message: "Must provide type, 'keywords','choices','arrangement' and 'shortAnswer' are currently only accepted", data: req.body.questions});
                        }
                        this.subTest.push(subTest);
                    }
                }
                this.titleService.setTitle('Mark tests - DigitalStudy');
            });
        });
    }

    submitFeedback() {
        let body = { questionResults: this.pickedId != null? this.questionResults : null,
            testFeedback: this.overallTestFeedback,
            subTest: this.pickedId != null? this.allocatedTest.submittedTests[this.pickedId]._id : null,
            test: this.allocatedTest._id};
        this.dataManagement.postDATA(global.url + '/api/tests/' + this.test._id + '/submitList', body).subscribe(dataResult=> {
                if(dataResult) {
                    this.dataEmitter.pushUpdateArray(dataResult.message,'Test submitted','success');
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

