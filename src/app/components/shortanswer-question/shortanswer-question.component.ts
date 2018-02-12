import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {DataEmitterService} from "../../services/data-emitter.service";
import {newQuestion, newTest, submittedQuestion} from "../../objects/objects";

@Component({
    selector: 'app-shortanswer-question',
    templateUrl: './shortanswer-question.component.html',
    styleUrls: ['./shortanswer-question.component.scss']
})
export class ShortanswerQuestionComponent implements OnInit, OnChanges {
    @Input('fullpage') fullPage: boolean;
    @Input('submit') submit: boolean;
    @Input('test') test: newTest;
    @Input('index') index: number;
    @Input('mark') mark: boolean;
    @Input('subQuestion') subQuestion: submittedQuestion;
    @Output() broadcastResult: EventEmitter<any> = new EventEmitter<any>();
    @Output('onBack') onBack: EventEmitter<any> = new EventEmitter<any>();
    @Output('onNext') onNext: EventEmitter<any> = new EventEmitter<any>();
    feedback;
    finalMark;// set as submitted q mark
    answer;

    constructor(
        private dataEmit: DataEmitterService
    ) { }

    ngOnChanges() {
        if(this.submit) {
            if(this.mark) {
                this.subQuestion.feedback = this.feedback;
                this.subQuestion.mark = this.finalMark;
                this.broadcastResult.emit(this.subQuestion);
            }else{
                this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
            }
        }

    }

    ngOnInit() {
        if(this.mark) {
            this.feedback = this.test.questions[this.index].feedback;
            this.finalMark = this.test.questions[this.index].mark;
            this.answer = this.test.questions[this.index].shortAnswer;
        }
    }

    onSubmit() {
        //this.dataEmit.pushAnswer(this.answer);
        this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
        this.answer = '';
    }

}