/**
 * Created by Kenji on 1/22/2018.
 */
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    //styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {


    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {

    }
}