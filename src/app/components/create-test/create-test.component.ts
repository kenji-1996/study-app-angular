import { Component, OnInit } from '@angular/core';
import {FormBuilder,  FormGroup, Validators} from "@angular/forms";
import {MatChipInputEvent} from "@angular/material";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {DragulaService} from "ng2-dragula";
@Component({
    selector: 'app-create-test',
    templateUrl: './create-test.component.html',
    styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {

    settingsFormGroup: FormGroup;
    addQuestionsFormGroup: FormGroup;
    questions = [];

    //drag
    public allChoices: Array<string> = [];
    public correctChoices: Array<string> = [];


    constructor(
        private formBuilder: FormBuilder,
        private dragulaService: DragulaService
    ) {
        dragulaService.setOptions('choices', { copy: true});
        dragulaService.drop.subscribe((value) => { this.onDrop(value); });
        dragulaService.out.subscribe((value) => {
            this.onOut(value.slice(1));
        });
    }

    ngOnInit() {
        this.settingsFormGroup = this.formBuilder.group({
            title: ['', Validators.required],
            category: ['', Validators.required],
        });
        this.addQuestionsFormGroup = this.formBuilder.group({
            type: ['', Validators.required],

            keywordQuestion: [''],

            choicesQuestion: [''],
            newChoice: [''],

            arrangementQuestion: [''],
            arrangement: [''],

            shortAnswerQuestion: [''],
            shortAnswer: [''],
        });
    }

    //Keywords
    separatorKeysCodes = [ENTER, COMMA];
    visible: boolean = true;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    keywords = [];

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

    //Drag options
    addChoice() {
        this.allChoices.push(this.addQuestionsFormGroup.value.newChoice);
        this.addQuestionsFormGroup.controls['newChoice'].setValue('');
    }

    private onOut(value) {
        let [item,target, source] = value;
        console.log(item);
        console.log(target);
        console.log(source);
        console.log("------------------------------------------------");
        //console.log('target id: ' + target.id);
        //console.log('source id: ' + source.id);
        if(target.id == source.id) {
            //this.deleteItem(this.allChoices,item.id);
            //this.deleteItem(this.correctChoices,item.id);
        }
        /*if(value[3].id == 'allChoices' && value[2] == null) {//if we drag from all into null (remove)
            console.log('removing an item from arrays');

        }*/
    }

    private onDrop(value) {
        let [bag,item,target,source,result] = value;
        /**
         * 1 - item
         * 2 - target
         * 3 - source
         * 4 - result (if nowhere will be null)
         */
        console.log(bag);
        console.log(item);
        console.log(target);
        console.log(source);
        console.log(result);
        console.log('--------------------------------');
        if(this.correctChoices.includes(value[1].id) ) {
            console.log('removing duplicates on correct');
            this.correctChoices =  Array.from(new Set(this.correctChoices));
        }
        if(value[2] == null && value[3].id == 'correctChoices') {
            this.deleteItem(this.correctChoices,value[1].id);
        }
        //if (value[2] == null) {value[1].remove();return; }
        /*if (value[2].id !== "correctChoices"
            && (value[3] !== null)
            && value[2].id !== value[3].id ) {
            this.allChoices =  Array.from(new Set(this.allChoices));
        }*/


    }

    deleteItem(array:any,pointer:any) {
        const index: number = array.indexOf(pointer);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

}
