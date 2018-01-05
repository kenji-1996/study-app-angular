import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";

@Component({
    selector: 'add-dialog',
    templateUrl: './add-dialog.html',
})
export class AddDialog {

    constructor(
        public dialogRef: MatDialogRef<AddDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    objectKeys = Object.keys;
    onNoClick(): void {
        this.dialogRef.close();
    }

    addTest() {
        console.log(this.data);
        var name = this.data.name;
        //this.dialogRef.close();
    }
}
