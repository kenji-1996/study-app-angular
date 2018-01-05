/**
 * Created by Kenji on 1/3/2018.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatButtonModule, MatCardModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatTableModule
} from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
    ],
    declarations: []
})
export class ImportsModule { }
