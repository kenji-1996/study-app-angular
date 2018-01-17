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
import {AddTest} from "./dialogs/addTest/add-test";
import {DataEmitterService} from "./services/data-emitter.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AddHeaderInterceptor} from "./modules/AddHeaderInterceptor";
import {EditTestNameDialog} from "./dialogs/editTestName/edit-test-name";
import {EditQuestionDialog} from "./dialogs/editQuestion/edit-question";
import {AuthGuard} from "./guards/auth.guard";
import { ResultComponent } from './components/result/result.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddTest,
    EditTestNameDialog,
    EditQuestionDialog,
    ResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    ImportsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AddTest,
    EditTestNameDialog,
    EditQuestionDialog,
  ],
  providers: [
    AuthenticateService,
    DataManagementService,
    AuthGuard,
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
