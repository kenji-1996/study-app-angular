import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {DataEmitterService} from "../../services/data-emitter.service";
import {newQuestion} from "../../objects/objects";

@Component({
    selector: 'app-keyword-question',
    templateUrl: './keyword-question.component.html',
    styleUrls: ['./keyword-question.component.scss']
})
export class KeywordQuestionComponent implements OnInit, OnChanges {
    @Input('fullpage') fullPage: boolean;
    @Input('submit') submit: boolean;
    @Input('question') question: newQuestion;
    @Input('index') index: number;
    @Output('broadcastAnswer') broadcastAnswer: EventEmitter<any> = new EventEmitter<any>();
    @Output('onBack') onBack: EventEmitter<any> = new EventEmitter<any>();
    @Output('onNext') onNext: EventEmitter<any> = new EventEmitter<any>();
    answer;

    constructor(
        private dataEmit: DataEmitterService
    ) { }

    ngOnInit() {
    }

    ngOnChanges() {
        if(this.submit) {
            this.broadcastAnswer.emit({question: this.question, answer: this.answer});
        }
    }

    onSubmit() {
        //this.dataEmit.pushAnswer(this.answer);
        /*this.question.keywordsAnswer = this.answer;
        this.broadcastAnswer.emit({question: this.question, answer: this.answer});
        this.answer = '';*/
    }

}