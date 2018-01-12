import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
    selector: 'edit-test-name',
    templateUrl: './edit-test-name.html',
})
export class EditTestNameDialog {

    constructor(
        public dialogRef: MatDialogRef<EditTestNameDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataManagement: DataManagementService,
        public dataEmit: DataEmitterService
    ) {
    }

    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }

    updateTest() {
        if(this.data.title) {
            var body = {
                title: this.data.title
            };
            this.dataManagement.putDATA(global.url + '/api/tests/' + this.data._id, body).subscribe(dataResult => {
                this.dataEmit.pushUpdateArray(dataResult.message);
                this.dialogRef.close();
            });

        }

    }
}
