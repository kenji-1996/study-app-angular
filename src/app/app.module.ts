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


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditTestDialog,
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    ImportsModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [
    EditTestDialog
  ],
  providers: [
    AuthenticateService,
    DataManagementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
