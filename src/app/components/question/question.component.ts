import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {DataEmitterService} from "../../services/data-emitter.service";
import { newTest, submittedQuestion} from "../../objects/objects";
import {DragulaService} from "ng2-dragula";
import {fadeAnimate, SlideInOutAnimation} from "../../misc/animation";

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    animations: [ SlideInOutAnimation, fadeAnimate ],
})
export class QuestionComponent implements OnInit, OnChanges {
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
    arrangementOptions;
    choicesOptions;
    model: any = {};

    constructor(
        private dataEmit: DataEmitterService,
        private dragulaService: DragulaService,
    ) {
        this.model.keywords = 'out';
        this.model.arrangement = 'out';
        this.model.choices = 'out';
        this.model.shortAnswer = 'out';
    }

    ngOnInit() {
        if(this.mark) {
            if(this.test.questions[this.index].type === 'keywords') {
                this.answer = this.test.questions[this.index].keywordsAnswer.join(' ');
            }
            if(this.test.questions[this.index].type === 'shortAnswer') {
                this.answer = this.test.questions[this.index].shortAnswer;
            }
            this.feedback = this.test.questions[this.index].feedback;
            this.finalMark = this.test.questions[this.index].mark;
        }
        if(this.test.questions[this.index].type === 'arrangement') {
            const bag: any = this.dragulaService.find('arrange');
            if (bag !== undefined ) this.dragulaService.destroy('arrange');
            this.arrangementOptions = { revertOnSpill: true, moves: (el, source, handle, sibling) => !this.mark };
            this.dragulaService.drop.subscribe((value) => {this.onDrop(value);});
            this.answer = [];
        }
        if(this.test.questions[this.index].type === 'choices') {
            this.dragulaService.setOptions('choices', {
                moves: (el, source, handle, sibling) => !this.mark
            });
            this.choicesOptions = {copy: true, copySortSource: true};
            this.dragulaService.drop.subscribe((value) => {this.onDrop(value);});
            this.answer = [];
        }
    }

    ngOnChanges() {
        if(this.submit) {
            if(this.mark) {
                this.broadcastResult.emit({id: this.subQuestion._id, mark: this.finalMark, feedback: this.feedback});
            }else{
                if(this.test.questions[this.index].type === 'arrangement') {
                    let arrangementNode = document.getElementById("arrangeOptions");
                    for(let i = 0; i < arrangementNode.children.length; i++){
                        this.answer.push(arrangementNode.children[i].id)
                    }
                    this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
                }
                if(this.test.questions[this.index].type === 'keywords') {
                    this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
                }
                if(this.test.questions[this.index].type === 'choices') {
                    let correctChoicesNode = document.getElementById("correctChoices");
                    for(let i = 0; i < correctChoicesNode.children.length; i++){
                        this.answer.push(correctChoicesNode.children[i].id)
                    }
                    this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
                }
                if(this.test.questions[this.index].type === 'shortAnswer') {
                    this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
                }
            }

        }
    }

    onSubmit() {
        //this.dataEmit.pushAnswer(this.answer);
        /*this.question.keywordsAnswer = this.answer;
        this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
        this.answer = '';*/
    }

    private onDrop(value) {
        let [bag,item,target,source,result] = value;
        let allChoicesNode = document.getElementById("allChoices");
        let correctChoicesNode = document.getElementById("correctChoices");
        if (target == null && source.id === 'correctChoices') { item.remove(); }
        if(target && target.id == 'correctChoices') {
            let ids = {};
            let children = correctChoicesNode.children;
            for ( var i = 0, len = children.length; i < len; i++ ) {
                var id = children[i].id;
                if (ids.hasOwnProperty(id)) { children[i].remove(); } else { ids[id] = true; }//a brand new id was discovered!
            }
        }
        if (target && target.id !== "correctChoices" && target.id !== source.id) { //dragged to a container that should not add the element
            //item.remove(); removes the whole element
        }
        if(source && source.id == 'correctChoices' && target == null) {
            console.log('attempted to remove ' + item.id);
            for(let i = 0; i < correctChoicesNode.children.length; i++){
                if(correctChoicesNode.children[i].id == item.id) {
                    correctChoicesNode.children[i].remove();
                }
            }
        }
    }

}