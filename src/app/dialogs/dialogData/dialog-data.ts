import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
    selector: 'dialog-data',
    templateUrl: './dialog-data.html',
})
export class DialogData {

    data;
    config;
    inputDialogOptions:any = [];
    selectDialogOptions:any = [];
    singleSelectChoice: null;

    constructor(
        public dialogRef: MatDialogRef<DialogData>,
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        private postData: DataManagementService,
        public dataEmit: DataEmitterService
    ) {
        this.data = inputData.data;
        this.config = inputData.config;
        console.log(this.data);
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].type === 'input') {
                this.inputDialogOptions.push(this.data[i]);
            }
            if(this.data[i].type === 'select') {
                this.selectDialogOptions.push(this.data[i]);
            }
        }
    }

    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }

    submit() {
        if(this.config.singleResult) {
            for(let i = 0; i < this.data.length; i++) {
                if(this.data[i].providedName == this.singleSelectChoice) {
                    this.inputData['result'] = {type: this.data[i].type, value: this.data[i].result};
                }
            }
        }
        this.dialogRef.close(this.inputData);
    }
}
