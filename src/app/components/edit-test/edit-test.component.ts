import { Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatChipInputEvent, MatDatepickerInputEvent} from "@angular/material";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {DragulaService} from "ng2-dragula";
import {newQuestion, newTest} from "../../objects/objects";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {DataEmitterService} from "../../services/data-emitter.service";
import {Router} from "@angular/router";
import {SlideInOutAnimation, fadeAnimate} from "../../misc/animation";

@Component({
    selector: 'app-edit-test',
    templateUrl: './edit-test.component.html',
    styleUrls: ['./edit-test.component.scss'],
    animations: [SlideInOutAnimation, fadeAnimate],
})
export class EditTestComponent implements OnInit {
    //Form and test settings
    @Input('test') testId;
    @Input('edit') editing: boolean;
    test;
    questionEditing;
    tempQuestion;
    settingsFormGroup: FormGroup;
    addQuestionsFormGroup: FormGroup;
    questions:newQuestion[]=[];
    authorList:string[] = [];
    animationState = 'out';

    //drag
    public allChoices: Array<string> = [];
    public correctChoices: Array<string> = [];
    arrangementOptions;
    choicesOptions;
    submitted = false;

    //Keywords
    separatorKeysCodes = [ENTER, COMMA];
    visible: boolean = true;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    keywords = [];

    constructor(
        private formBuilder: FormBuilder,
        private dragulaService: DragulaService,
        private dataManagement: DataManagementService,
        private dataEmit: DataEmitterService,
        private router: Router,
    ) {
        this.arrangementOptions = { removeOnSpill: true };
        this.choicesOptions = {copy: true, copySortSource: true};
        dragulaService.drop.subscribe((value) => {this.onDrop(value);});
    }

    ngOnInit() {
        this.addQuestionsFormGroup = this.formBuilder.group({
            type: [null],
            question: [null],
            hint: [null],
            enableTimer: false,
            timer: null,
            newChoice: [null],
            arrangement: [null],
            newArrange: [null],
            shortAnswer: [null],
        });
        this.settingsFormGroup = this.formBuilder.group({
            title: [null, Validators.required],
            category: [null, Validators.required],
            authors: [null],
            allowHint: false,
            fullPage: false,
            expire: false,
            expireDate: null,
            handMarked: false,
            editable: false,
            shareable: false,
            timerEnabled: false,
            timerLength: [null, Validators.pattern(/^\d+$/)],
            showMarks: false,
            limitAttempts: false,
            limitAmount: null,
            locked: false,
            selfRemovable: false,
            mark: false,
            markDate: null,
            private: false,
            showMarker: false,
        });
        if(this.testId == null) {
            this.authorList.push(JSON.parse(localStorage.getItem('userObject'))._id);
            this.test = new newTest('','',this.questions,this.authorList);
        }else{
            this.dataManagement.getDATA(global.url + '/api/tests/author/' + this.testId).subscribe(httpTest => {
                console.log(this.test);
                this.test = httpTest.data;
                this.settingsFormGroup.controls.title.setValue(this.test.title);
                this.settingsFormGroup.controls.category.setValue(this.test.category);
                this.settingsFormGroup.controls.allowHint.setValue(this.test.hintAllowed);
                this.settingsFormGroup.controls.fullPage.setValue(this.test.fullPage);
                this.settingsFormGroup.controls.expire.setValue(this.test.expire);
                if(this.test.expire) { this.settingsFormGroup.controls.expireDate.setValue(this.test.expireDate); }
                this.settingsFormGroup.controls.handMarked.setValue(this.test.handMarked);
                this.settingsFormGroup.controls.editable.setValue(this.test.userEditable);
                this.settingsFormGroup.controls.shareable.setValue(this.test.shareable);
                this.settingsFormGroup.controls.timerEnabled.setValue(this.test.timer >= 1);
                if(this.test.timerEnabled) {this.settingsFormGroup.controls.timerLength.setValue(this.test.timer);}
                this.settingsFormGroup.controls.showMarks.setValue(this.test.showMarks);
                this.settingsFormGroup.controls.limitAttempts.setValue(this.test.attemptsAllowed >= 1);
                this.settingsFormGroup.controls.limitAmount.setValue(this.test.attemptsAllowed === 0? null : this.test.attemptsAllowed);
                this.settingsFormGroup.controls.locked.setValue(this.test.locked);
                this.settingsFormGroup.controls.selfRemovable.setValue(this.test.canSelfRemove);
                this.settingsFormGroup.controls.mark.setValue(this.test.markDate);
                this.settingsFormGroup.controls.markDate.setValue(this.test.markDate);
                this.settingsFormGroup.controls.private.setValue(this.test.private);
                this.settingsFormGroup.controls.showMarker.setValue(this.test.showMarker);
            });
        }
    }

    cancel() {
        if(this.questionEditing) {
            this.test.questions.push(this.tempQuestion);
        }
        this.resetForms();
    }

    modifyQuestion(q:newQuestion) {
        this.clearDragContainers();
        this.questionEditing = true;
        this.tempQuestion = q;
        this.addQuestionsFormGroup.controls['type'].setValue(q.type);
        this.addQuestionsFormGroup.controls['question'].setValue(q.question);
        this.addQuestionsFormGroup.controls['hint'].setValue(q.hint);
        this.addQuestionsFormGroup.controls['enableTimer'].setValue(q.enableTimer);
        this.addQuestionsFormGroup.controls['timer'].setValue(q.timer);
        if(q.type === 'keywords') {
            this.keywords =  q.keywordsAnswer;
        }else if(q.type === 'shortAnswer') {
            this.addQuestionsFormGroup.controls['shortAnswer'].setValue(q.shortAnswer);
        }else if(q.type === 'choices') {
            this.clearDragContainers();
            let allChoicesNode = document.getElementById("allChoices");
            let correctChoicesNode = document.getElementById("correctChoices");
            for(let i = 0; i < (q.choicesAll.length); i++) {
                if(q.choicesAll[i]) {
                    let div = document.createElement("DIV");
                    div.setAttribute("id", q.choicesAll[i]);
                    div.innerHTML = q.choicesAll[i];
                    div.className = this.arrayContains(q.choicesAll[i],q.choicesAnswer)? 'alert alert-success' : 'alert alert-danger';
                    allChoicesNode.appendChild(div);
                }
            }
            for(let i = 0; i < (q.choicesAnswer.length); i++) {
                if(q.choicesAnswer[i]) {
                    let div = document.createElement("DIV");
                    div.setAttribute("id", q.choicesAnswer[i]);
                    div.innerHTML = q.choicesAnswer[i];
                    div.className = 'alert alert-success';
                    correctChoicesNode.appendChild(div);
                }
            }
        }else if(q.type === 'arrangement') {
            for (let i = 0; i < q.arrangement.length; i++) {
                this.addDragItem('arrangeOptions', q.arrangement[i], 'alert alert-info');
            }
        }
        this.addQuestionsFormGroup.controls['question'].setValue(q.question);
        this.deleteQuestion(q);
    }

    addEvent(event: MatDatepickerInputEvent<Date>, type: any) {
        if(type === 'expire') {
            this.test.expireDate = new Date(event.value);
        }
        if(type === 'mark') {
            this.test.markDate = new Date(event.value);
        }

    }

    removeTag(word:any) {
        const index: number = this.keywords.indexOf(word);
        if (index !== -1) {
            this.keywords.splice(index, 1);
        }
    }

    addTag(event: MatChipInputEvent): void {
        let input = event.input;
        let value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.keywords.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    insertQuestion(type:any) {
        let finalQuestion = new newQuestion();
        finalQuestion.type = type;
        if(this.addQuestionsFormGroup.controls['question'].value) {
            finalQuestion.question = this.addQuestionsFormGroup.controls['question'].value;
        }else{
            alert('A question is needed');
            return;
        }
        if(this.addQuestionsFormGroup.controls['hint'].value) {
            finalQuestion.hint = this.addQuestionsFormGroup.controls['hint'].value;
        }
        if(this.addQuestionsFormGroup.controls['enableTimer'].value && this.addQuestionsFormGroup.controls['timer'].value) {
            finalQuestion.enableTimer = true;
            finalQuestion.timer = this.addQuestionsFormGroup.controls['timer'].value;
        }
        switch (type) {
            case "keywords":
                if(this.keywords != []) {
                    let keywords = this.keywords as [string];
                    finalQuestion.keywordsAnswer = keywords;
                }else{
                    alert('No keywords found');
                    return;
                }
                this.test.questions.push(finalQuestion);
                this.resetForms();
                break;
            case "choices":
                let allChoicesNode = document.getElementById("allChoices");
                let correctChoicesNode = document.getElementById("correctChoices");
                if(allChoicesNode.children.length < 2 || allChoicesNode.children.length < 1) {
                    alert('Choice question needs atleast 2 choices and 1 correct choice'); // TODO: Add trick question options etc
                    return;
                }
                for(let i = 0; i < allChoicesNode.children.length; i++){
                    finalQuestion.choicesAll.push(allChoicesNode.children[i].id)
                }
                for(let i = 0; i < correctChoicesNode.children.length; i++){
                    finalQuestion.choicesAnswer.push(correctChoicesNode.children[i].id)
                }
                this.test.questions.push(finalQuestion);
                this.resetForms();
                break;
            case "arrangement":// TODO: Add option to set the viewed order instead of random
                let arrangeOptionsNode = document.getElementById("arrangeOptions");
                if(arrangeOptionsNode.children.length < 2) {
                    alert('atleast 2 options for arrangement are required');
                    return;
                }
                for(let i = 0; i < arrangeOptionsNode.children.length; i++){
                    finalQuestion.arrangement.push(arrangeOptionsNode.children[i].id)
                }
                this.test.questions.push(finalQuestion);
                this.resetForms();
                break;
            case "shortAnswer":
                if(this.addQuestionsFormGroup.controls['shortAnswer'].value) {
                    finalQuestion.shortAnswer = this.addQuestionsFormGroup.controls['shortAnswer'].value;
                }else{
                    alert('Short answer needs an answer');
                    return;
                }
                this.test.questions.push(finalQuestion);
                this.resetForms();
                break;
            default:
                confirm("Select a question type and input the details!");
        }

    }

    resetForms() {
        this.addQuestionsFormGroup.controls['hint'].setValue('');
        this.addQuestionsFormGroup.controls['type'].setValue('');
        this.addQuestionsFormGroup.controls['question'].setValue('');
        this.addQuestionsFormGroup.controls['shortAnswer'].setValue('');
        this.addQuestionsFormGroup.controls['arrangement'].setValue('');
        this.addQuestionsFormGroup.controls['timer'].setValue('');
        this.addQuestionsFormGroup.controls['arrangement'].setValue('');
        this.addQuestionsFormGroup.controls['enableTimer'].setValue('');
        this.keywords = [];
        this.clearDragContainers();
    }

    clearDragContainers() {
        let allChoicesNode = document.getElementById("allChoices");
        let correctChoicesNode = document.getElementById("correctChoices");
        let arrangeOptionsNode = document.getElementById("arrangeOptions");
        while (allChoicesNode.lastChild) {
            allChoicesNode.removeChild(allChoicesNode.firstChild);
        }
        while (correctChoicesNode.lastChild) {
            correctChoicesNode.removeChild(correctChoicesNode.firstChild);
        }
        while (arrangeOptionsNode.lastChild) {
            arrangeOptionsNode.removeChild(arrangeOptionsNode.firstChild);
        }
    }

    confirmTest() {
        this.submitted = true;
        this.test.title = this.settingsFormGroup.controls['title'].value;
        this.test.category = this.settingsFormGroup.controls['category'].value;
        this.test.hintAllowed = this.settingsFormGroup.controls['allowHint'].value;
        this.test.fullPage = this.settingsFormGroup.controls['fullPage'].value;
        this.test.handMarked = this.settingsFormGroup.controls['handMarked'].value;
        this.test.userEditable = this.settingsFormGroup.controls['editable'].value;
        this.test.shareable = this.settingsFormGroup.controls['shareable'].value;
        this.test.showMarks = this.settingsFormGroup.controls['showMarks'].value;
        this.test.locked = this.settingsFormGroup.controls['locked'].value;
        this.test.canSelfRemove = this.settingsFormGroup.controls['selfRemovable'].value;
        this.test.privateTest = this.settingsFormGroup.controls['private'].value;
        this.test.showMarker = this.settingsFormGroup.controls['showMarker'].value;
        this.test.attemptsAllowed = this.settingsFormGroup.controls['limitAttempts'].value? this.settingsFormGroup.controls['limitAmount'].value : 0;
        this.test.expire = this.settingsFormGroup.controls['expire'].value;
        this.test.expireDate = this.settingsFormGroup.controls['expireDate'].value;
        this.test.timerEnabled = this.settingsFormGroup.controls['timerEnabled'].value;
        this.test.timer = this.settingsFormGroup.controls['timerEnabled'].value? this.settingsFormGroup.controls['timerLength'].value : 0;
        this.test.markDate =  this.settingsFormGroup.controls['mark'].value? this.settingsFormGroup.controls['markDate'].value : null;
        let body = { test: this.test };
        if(this.editing) {
            this.dataManagement.putDATA(global.url + '/api/tests/' + this.test._id, body).subscribe(dataResult=> {
                if(dataResult) {
                    this.submitted = false;
                    this.dataEmit.pushUpdateArray(dataResult.message);
                    this.router.navigate(['author/tests']);
                }
            });
        }else{
            this.dataManagement.postDATA(global.url + '/api/tests', body).subscribe(dataResult=> {
                if(dataResult) {
                    this.submitted = false;
                    this.dataEmit.pushUpdateArray(dataResult.message);
                    this.router.navigate(['author/tests']);
                }
            });
        }
    }

    addAuthor() {
        this.test.authors.push(this.settingsFormGroup.value.authors);
        this.settingsFormGroup.controls['authors'].setValue('');
    }

    arrayContains(needle, arrhaystack) {
        return (arrhaystack.indexOf(needle) > -1);
    }

    addDragItem(targetDiv:any,divData:any,classes:any) {
        let allChoicesNode = document.getElementById(targetDiv);
        let newDiv = document.createElement("DIV");
        let divID = divData;
        newDiv.id = divID;
        newDiv.innerText = divID;
        newDiv.className = classes;
        allChoicesNode.appendChild(newDiv);
        this.addQuestionsFormGroup.controls['newChoice'].setValue('');
        this.addQuestionsFormGroup.controls['newArrange'].setValue('');
    }

    removeDuplicates(nodeID:any) {
        //Remove duplicate ID's
        let node = document.getElementById(nodeID);
        let ids = {};
        let children = node.children;
        for ( var i = 0, len = children.length; i < len; i++ ) {
            var id = children[i].id;
            if (ids.hasOwnProperty(id)) { children[i].remove(); } else { ids[id] = true; }//a brand new id was discovered!
        }
    }

    private onDrop(value) {
        let [bag,item,target,source,result] = value;
        let allChoicesNode = document.getElementById("allChoices");
        let correctChoicesNode = document.getElementById("correctChoices");
        if (target == null) { item.remove(); }
        if(target && target.id == 'correctChoices') {
            //Remove duplicate ID's
            this.removeDuplicates('correctChoices');
            this.classDivs(allChoicesNode,correctChoicesNode,item);
        }
        if (target && target.id !== "correctChoices" && target.id !== source.id) { //dragged to a container that should not add the element
            item.remove();
        }
        if(source && source.id == 'allChoices' && target == null) {
            for(let i = 0; i < allChoicesNode.children.length; i++){
                if(allChoicesNode.children[i].id == item.id) {
                    allChoicesNode.children[i].remove();
                }
            }
            for(let i = 0; i < correctChoicesNode.children.length; i++){
                if(correctChoicesNode.children[i].id == item.id) {
                    correctChoicesNode.children[i].remove();
                }
            }
        }
        if(source && source.id == 'correctChoices' && target == null) {
            for(let i = 0; i < correctChoicesNode.children.length; i++){
                if(correctChoicesNode.children[i].id == item.id) {
                    correctChoicesNode.children[i].remove();
                }
                document.getElementById(item.id).className = 'alert alert-danger';
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
            if(allChoicesNode.children[i].id === correctItem.id) {
                allChoicesNode.children[i].className = 'alert alert-success';
            }
        }
    }

    deleteQuestion(target:newQuestion) {
        this.test.questions = this.test.questions.filter(item => item !== target);
    }

    deleteAuthor(target:any) {
        this.test.authors = this.test.authors.filter(item => item !== target);
    }
}