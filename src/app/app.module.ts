import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import {AppRouterModule} from "./modules/app-router";
import { HomeComponent } from './components/home/home.component';

import {AuthenticateService} from "./services/authenticate.service";
import {DataManagementService} from "./services/data-management.service";
import {ImportsModule} from "./modules/imports.module";
import { TestManagerComponent } from './components/test-manager/test-manager.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {EditTestDialog} from "./dialogs/editTest/edit-test.component";
import { TempComponent } from './components/temp/temp.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AddDialog} from "./dialogs/addDialog/add-dialog";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditTestDialog,
    TempComponent,
    AddDialog,
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    ImportsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    EditTestDialog,
    AddDialog
  ],
  providers: [
    AuthenticateService,
    DataManagementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
