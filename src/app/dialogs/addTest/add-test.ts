import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
    selector: 'add-test',
    templateUrl: './add-test.html',
})
export class AddTest {

    constructor(
        public dialogRef: MatDialogRef<AddTest>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private postData: DataManagementService,
        public dataEmit: DataEmitterService
    ) {
    }

    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }

    addTest() {
        if(this.data.name) {
            var body = {
                userid: JSON.parse(localStorage.getItem('userObject'))._id,
                title: this.data.name
            };

            this.postData.postDATA(global.url + '/api/tests', body).subscribe(dataResult => {
                this.dataEmit.pushUpdateArray(dataResult.message);

                this.dialogRef.close(dataResult.data._id);
            });
        }

    }
}
