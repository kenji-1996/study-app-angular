import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';

@Component({
    selector: 'add-dialog',
    templateUrl: './add-dialog.html',
})
export class AddDialog {

    constructor(
        public dialogRef: MatDialogRef<AddDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private postData: DataManagementService,) {
    }
    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }

    addTest() {
        if(this.data.name) {
            var body = {
                idtoken: localStorage.getItem('idtoken'),
                action: 'add',
                title: this.data.name/*, type: 'list'*/
            };
            this.postData.postDATA(global.url + '/api/test', body).subscribe(dataResult => {
                console.log(dataResult);
            });
            this.dialogRef.close();
        }

    }
}
