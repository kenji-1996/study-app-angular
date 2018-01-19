import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import {AppRouterModule} from "./modules/app-router";
import { LoginComponent } from './components/login/login.component';

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
import {LoginGuard} from "./guards/login.guard";
import { FourOhFourPage } from './components/404-page/404-page.component';
import { StringtodatePipe } from './pipes/stringtodate.pipe';
import { AddNewsComponent } from './components/add-news/add-news.component';
import {NgIfMediaQuery} from "./misc/media-query-directive";
import {EditTestDialog} from "./dialogs/editTest/edit-test.component";
import {AuthGuard} from "./guards/auth.guard";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddTest,
    EditTestDialog,
    EditTestNameDialog,
    EditQuestionDialog,
    FourOhFourPage,
    StringtodatePipe,
    NgIfMediaQuery,
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
    LoginGuard,
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
