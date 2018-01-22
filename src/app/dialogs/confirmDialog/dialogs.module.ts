/**
 * Created by Kenji on 1/22/2018.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import {ConfirmDialogComponent} from "./confirm-dialog.component";
import {DialogsService} from "../../services/dialogs.service";
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
    ],
    declarations: [ConfirmDialogComponent],
    exports: [ConfirmDialogComponent],
    entryComponents: [ConfirmDialogComponent],
    providers: [DialogsService]
})
export class DialogsModule { }