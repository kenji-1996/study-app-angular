import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {DataEmitterService} from "../../services/data-emitter.service";
import {DragulaService} from "ng2-dragula";
import {newQuestion, newTest, submittedQuestion} from "../../objects/objects";

@Component({
    selector: 'app-choice-question',
    templateUrl: './choice-question.component.html',
    styleUrls: ['./choice-question.component.scss']
})
export class ChoiceQuestionComponent implements OnInit,OnChanges {
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
    answer = [];
    choicesOptions;

    constructor(
        private dataEmit: DataEmitterService,
        private dragulaService: DragulaService,
    ) {
        dragulaService.setOptions('choices', {
            moves: (el, source, handle, sibling) => !this.mark
        });
        this.choicesOptions = {copy: true, copySortSource: true};
        dragulaService.drop.subscribe((value) => {this.onDrop(value);});
    }

    ngOnInit() {
        this.feedback = this.test.questions[this.index].feedback;
        this.finalMark = this.test.questions[this.index].mark;
    }

    ngOnChanges() {
        if(this.submit && this.mark) {
            this.broadcastResult.emit({id: this.subQuestion._id,mark: this.finalMark, feedback: this.feedback});
        }
        if(this.submit && !this.mark) {
            let correctChoicesNode = document.getElementById("correctChoices");
            for(let i = 0; i < correctChoicesNode.children.length; i++){
                this.answer.push(correctChoicesNode.children[i].id)
            }
            this.broadcastResult.emit({question: this.test.questions[this.index], answer: this.answer});
        }
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
            this.classDivs(allChoicesNode,correctChoicesNode,item);
        }
        if (target && target.id !== "correctChoices" && target.id !== source.id) { //dragged to a container that should not add the element
            //item.remove(); removes the whole element
        }
        if(source && source.id == 'correctChoices' && target == null) {
            console.log('attempted to remove ' + item.id);
            this.removeClassDivs(allChoicesNode,item);
            for(let i = 0; i < correctChoicesNode.children.length; i++){
                if(correctChoicesNode.children[i].id == item.id) {
                    correctChoicesNode.children[i].remove();
                }
            }
        }
    }

    removeClassDivs(allChoicesNode:any,item:any) {
        for ( let i = 0, len = allChoicesNode.children.length; i < len; i++ ) {
            if(allChoicesNode.children[i].id == item.id) {
                allChoicesNode.children[i].className = 'alert alert-danger';
            }
        }
    }

    classDivs(allChoicesNode:any,correctChoicesNode:any,correctItem:any) {
        for ( let i = 0, len = correctChoicesNode.children.length; i < len; i++ ) {
            if(correctChoicesNode.children[i].id == correctItem.id) {
                correctChoicesNode.children[i].className = 'alert alert-success';
            }
        }
        for ( let i = 0, len = allChoicesNode.children.length; i < len; i++ ) {
            if(allChoicesNode.children[i].id == correctItem.id) {
                allChoicesNode.children[i].className = 'alert alert-success';
            }
        }
    }

}