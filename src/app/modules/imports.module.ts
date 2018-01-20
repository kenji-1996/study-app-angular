/**
 * Created by Kenji on 1/3/2018.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatExpansionModule,
    MatFormFieldModule, MatGridListModule,
    MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatProgressBarModule, MatSidenavModule, MatSnackBarModule,
    MatTableModule, MatToolbarModule, MatTooltipModule
} from "@angular/material";
import {NgHttpLoaderModule} from "ng-http-loader/ng-http-loader.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NbLayoutModule, NbSidebarModule} from "@nebular/theme";

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
        MatTooltipModule,
        MatGridListModule,
        FlexLayoutModule,
        NbLayoutModule,
        NbSidebarModule,
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
        MatTooltipModule,
        MatGridListModule,
        FlexLayoutModule,
        NbLayoutModule,
        NbSidebarModule,
    ],
    declarations: []
})
export class ImportsModule { }
