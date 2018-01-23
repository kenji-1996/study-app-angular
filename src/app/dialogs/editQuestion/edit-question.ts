import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {DataEmitterService} from "../../services/data-emitter.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'edit-test-name',
    templateUrl: './edit-question.html',
    styleUrls: ['./edit-question.scss']
})
export class EditQuestionDialog {

    constructor(
        public dialogRef: MatDialogRef<EditQuestionDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataManagement: DataManagementService,
        public dataEmit: DataEmitterService
    ) {
    }

    separatorKeysCodes = [ENTER, COMMA];
    visible: boolean = true;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;

    removeKeyword(word:any) {
        const index: number = this.data.keywords.indexOf(word);
        if (index !== -1) {
            this.data.keywords.splice(index, 1);
        }
    }

    questionField = new FormControl('', Validators.required);
    answerField = new FormControl('', Validators.required);

    add(event: MatChipInputEvent): void {
        let input = event.input;
        let value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.data.keywords.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }
}
