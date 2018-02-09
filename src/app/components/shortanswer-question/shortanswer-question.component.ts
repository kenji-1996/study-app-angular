import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {DataEmitterService} from "../../services/data-emitter.service";
import {newQuestion} from "../../objects/objects";

@Component({
    selector: 'app-shortanswer-question',
    templateUrl: './shortanswer-question.component.html',
    styleUrls: ['./shortanswer-question.component.scss']
})
export class ShortanswerQuestionComponent implements OnInit, OnChanges {
    @Input('fullpage') fullPage: boolean;
    @Input('submit') submit: boolean;
    @Input('question') question: newQuestion;
    @Input('index') index: number;
    @Output() broadcastAnswer: EventEmitter<any> = new EventEmitter<any>();
    @Output('onBack') onBack: EventEmitter<any> = new EventEmitter<any>();
    @Output('onNext') onNext: EventEmitter<any> = new EventEmitter<any>();
    answer;
    constructor(
        private dataEmit: DataEmitterService
    ) { }

    ngOnChanges() {
        if(this.submit) {
            this.broadcastAnswer.emit({question: this.question, answer: this.answer});
        }
    }

    ngOnInit() {
    }

    onSubmit() {
        //this.dataEmit.pushAnswer(this.answer);
        this.broadcastAnswer.emit({question: this.question, answer: this.answer});
        this.answer = '';
    }

}