/**
 * Created by Kenji on 1/3/2018.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule, MatGridListModule,
    MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatProgressBarModule, MatSidenavModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule, MatToolbarModule, MatTooltipModule
} from "@angular/material";
import {NgHttpLoaderModule} from "ng-http-loader/ng-http-loader.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
    NbActionsModule, NbCardModule, NbCheckboxModule, NbLayoutModule, NbMenuModule, NbRouteTabsetModule, NbSearchModule,
    NbSidebarModule, NbTabsetModule, NbThemeModule, NbUserModule
} from "@nebular/theme";
import {NbSharedModule} from "@nebular/theme/components/shared/shared.module";
import {NgbCollapseModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DragulaModule} from "ng2-dragula";

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
        MatStepperModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,

        FlexLayoutModule,

        NbLayoutModule,
        NbCardModule,
        NbSidebarModule,
        NbTabsetModule,
        NbRouteTabsetModule,
        NbActionsModule,
        NbMenuModule,
        NbUserModule,
        NbCheckboxModule,

        NgbModule,
        NgbCollapseModule,

        DragulaModule,
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
        MatStepperModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,

        FlexLayoutModule,

        NbLayoutModule,
        NbCardModule,
        NbSearchModule,
        NbSidebarModule,
        NbTabsetModule,
        NbRouteTabsetModule,
        NbActionsModule,
        NbMenuModule,
        NbUserModule,
        NbCheckboxModule,

        NgbModule,
        NgbCollapseModule,

        DragulaModule,

    ],
    declarations: []
})
export class ImportsModule { }
