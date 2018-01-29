import { Component, OnInit,} from '@angular/core';
import {FormBuilder,  FormGroup, Validators, FormControl} from "@angular/forms";
import {MatChipInputEvent, MatDatepickerInputEvent} from "@angular/material";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {DragulaService} from "ng2-dragula";
import {newQuestion, newTest} from "../../objects/objects";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
@Component({
    selector: 'app-create-test',
    templateUrl: './create-test.component.html',
    styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {

    //Form and test settings
    settingsFormGroup: FormGroup;
    addQuestionsFormGroup: FormGroup;
    test;
    questions:newQuestion[]=[];
    authors:string[] = [];
    allowHint: false;
    fullPage: false;
    expire: false;
    handMarked: false;
    private: false;
    editable: false;
    shareable: false;
    timerEnabled: false;
    showMarks: false;
    timer = new FormControl({value: null, disabled: true}, Validators.pattern(/^\d+$/));

    //drag
    public allChoices: Array<string> = [];
    public correctChoices: Array<string> = [];
    arrangementOptions;
    choicesOptions;

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
        private dataManagement: DataManagementService
    ) {

        this.arrangementOptions = { removeOnSpill: true };
        this.choicesOptions = {copy: true, copySortSource: true};
        dragulaService.drop.subscribe((value) => {this.onDrop(value);});
    }

    ngOnInit() {
        this.authors.push(JSON.parse(localStorage.getItem('userObject'))._id);
        this.test = new newTest('temp title','temp category',this.questions,this.authors);
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
        });
        this.addQuestionsFormGroup = this.formBuilder.group({
            type: [null],
            question: [null],
            hint: [null],
            enableTimer: false,
            timer: this.timer,
            newChoice: [null],
            arrangement: [null],
            newArrange: [null],
            shortAnswer: [null],
        });
    }

    disableTimer() {
        if(this.addQuestionsFormGroup.controls['enableTimer'].value) {
            this.addQuestionsFormGroup.controls['timer'].disable();
        }else{
            this.addQuestionsFormGroup.controls['timer'].enable();
        }
    }

    addEvent(event: MatDatepickerInputEvent<Date>) {
        this.test.expireDate = new Date(event.value);
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
        if(this.addQuestionsFormGroup.controls['question'].value != '') {
            finalQuestion.question = this.addQuestionsFormGroup.controls['question'].value;
        }else{
            alert('A question is needed');
            return;
        }
        if(this.addQuestionsFormGroup.controls['hint'].value != '') {
            finalQuestion.hint = this.addQuestionsFormGroup.controls['hint'].value;
        }
        if(this.addQuestionsFormGroup.controls['enableTimer'].value && this.addQuestionsFormGroup.controls['timer'].value > 0) {
            finalQuestion.enableTimer = true;
            finalQuestion.timer = this.addQuestionsFormGroup.controls['timer'].value;
        }
        switch (type) {
            case "keywords":
                if(this.keywords != []) {
                    let keywords = this.keywords as [String];
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
                    console.log(arrangeOptionsNode.children[i].id);
                    finalQuestion.arrangement.push(arrangeOptionsNode.children[i].id)
                }
                this.test.questions.push(finalQuestion);
                this.resetForms();
                break;
            case "shortAnswer":
                if(this.addQuestionsFormGroup.controls['shortAnswer'].value != '') {
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
        console.log(this.test);
        this.addQuestionsFormGroup.controls['hint'].setValue('');
        this.addQuestionsFormGroup.controls['type'].setValue('');
        this.addQuestionsFormGroup.controls['question'].setValue('');
        this.addQuestionsFormGroup.controls['shortAnswer'].setValue('');
        this.addQuestionsFormGroup.controls['arrangement'].setValue('');
        this.addQuestionsFormGroup.controls['timer'].setValue('');
        this.addQuestionsFormGroup.controls['arrangement'].setValue('');
        this.addQuestionsFormGroup.controls['enableTimer'].setValue('');
        this.keywords = [];
        let allChoicesNode = document.getElementById("allChoices");
        let correctChoicesNode = document.getElementById("correctChoices");
        let arrangeOptionsNode = document.getElementById("arrangeOptions");
        if(allChoicesNode && allChoicesNode.children) {
            for(let i = 0; i < allChoicesNode.children.length; i++){
                allChoicesNode.children[i].remove();
            }
        }
        if(correctChoicesNode && correctChoicesNode.children) {
            for (let i = 0; i < correctChoicesNode.children.length; i++) {
                correctChoicesNode.children[i].remove();
            }
        }
        if(arrangeOptionsNode && arrangeOptionsNode.children) {
            for (let i = 0; i < arrangeOptionsNode.children.length; i++) {
                arrangeOptionsNode.children[i].remove();
            }
        }
    }

    confirmTest() {
        this.test.title = this.settingsFormGroup.controls['title'].value;
        this.test.category = this.settingsFormGroup.controls['category'].value;
        this.test.expire = this.settingsFormGroup.controls['expire'].value;
        this.test.fullPage = this.settingsFormGroup.controls['fullPage'].value;
        this.test.allowHint = this.settingsFormGroup.controls['allowHint'].value;
        this.test.handMarked = this.settingsFormGroup.controls['handMarked'].value;
        this.test.editable = this.settingsFormGroup.controls['editable'].value;
        this.test.shareable = this.settingsFormGroup.controls['shareable'].value;
        this.test.timerEnabled = this.settingsFormGroup.controls['timerEnabled'].value;
        if(this.test.timerEnabled) {
            this.test.timer = this.settingsFormGroup.controls['timerLength'].value;
        }
        this.test.showMarks = this.settingsFormGroup.controls['showMarks'].value;
        console.log(this.test);
        let body = { test: this.test};
        this.dataManagement.postDATA(global.url + '/api/tests', body).subscribe(dataResult=> {
            if(dataResult) {
                console.log(dataResult.message);
                //this.dataEmit.pushUpdateArray(dataResult.message);
            }
        });

    }

    onlyDecimalNumberKey(event) {
        let charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    addAuthor() {
        this.test.authors.push(this.settingsFormGroup.value.authors);
        this.settingsFormGroup.controls['authors'].setValue('');
    }

    //Drag options
    addChoice() {
        let allChoicesNode = document.getElementById("allChoices");
        let newDiv = document.createElement("DIV");
        newDiv.id = this.addQuestionsFormGroup.value.newChoice;
        newDiv.innerText = this.addQuestionsFormGroup.value.newChoice;
        newDiv.className = "alert alert-danger";
        allChoicesNode.appendChild(newDiv);
        this.addQuestionsFormGroup.controls['newChoice'].setValue('');
    }

    addArrange() {
        let allArrangeNode = document.getElementById("arrangeOptions");
        let newDiv = document.createElement("DIV");
        newDiv.id = this.addQuestionsFormGroup.value.newArrange;
        newDiv.innerText = this.addQuestionsFormGroup.value.newArrange;
        allArrangeNode.appendChild(newDiv);
        this.addQuestionsFormGroup.controls['newArrange'].setValue('');
    }

    private onDrop(value) {
        let [bag,item,target,source,result] = value;
        let allChoicesNode = document.getElementById("allChoices");
        let correctChoicesNode = document.getElementById("correctChoices");
        if (target == null) { item.remove(); }
        if(target && target.id == 'correctChoices') {
            //Remove duplicate ID's
            let ids = {};
            let children = correctChoicesNode.children;
            for ( var i = 0, len = children.length; i < len; i++ ) {
                var id = children[i].id;
                if (ids.hasOwnProperty(id)) { children[i].remove(); } else { ids[id] = true; }//a brand new id was discovered!
            }
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

    deleteItem(array:any,pointer:any) {
        const index: number = array.indexOf(pointer);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

}
