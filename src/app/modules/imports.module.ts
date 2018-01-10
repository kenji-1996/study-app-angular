/**
 * Created by Kenji on 1/3/2018.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatProgressBarModule, MatSidenavModule, MatSnackBarModule,
    MatTableModule, MatToolbarModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NgHttpLoaderModule} from "ng-http-loader/ng-http-loader.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgHttpLoaderModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        MatListModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatCheckboxModule,
        FlexLayoutModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgHttpLoaderModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        MatListModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatCheckboxModule,
        FlexLayoutModule,
    ],
    declarations: []
})
export class ImportsModule { }
