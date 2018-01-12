import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import {AppRouterModule} from "./modules/app-router";
import { HomeComponent } from './components/home/home.component';

import {AuthenticateService} from "./services/authenticate.service";
import {DataManagementService} from "./services/data-management.service";
import {ImportsModule} from "./modules/imports.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import {AddDialog} from "./dialogs/addDialog/add-dialog";
import {DataEmitterService} from "./services/data-emitter.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AddHeaderInterceptor} from "./modules/AddHeaderInterceptor";
import {EditTestNameDialog} from "./dialogs/editTestName/edit-test-name";
import {EditQuestionDialog} from "./dialogs/editQuestion/edit-question";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddDialog,
    EditTestNameDialog,
    EditQuestionDialog,
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    ImportsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AddDialog,
    EditTestNameDialog,
    EditQuestionDialog,
  ],
  providers: [
    AuthenticateService,
    DataManagementService,
    DataEmitterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
