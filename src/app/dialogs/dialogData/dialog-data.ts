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

    constructor(
        public dialogRef: MatDialogRef<DialogData>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private postData: DataManagementService,
        public dataEmit: DataEmitterService
    ) {
    }

    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close(this.data);
    }
}
