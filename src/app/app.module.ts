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
import {DataEmitterService} from "./services/data-emitter.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AddHeaderInterceptor, HttpErrorInterceptor} from "./modules/AddHeaderInterceptor";
import {EditTestNameDialog} from "./dialogs/editTestName/edit-test-name";
import {EditQuestionDialog} from "./dialogs/editQuestion/edit-question";
import {LoginGuard} from "./guards/login.guard";
import { FourOhFourPage } from './components/404-page/404-page.component';
import { StringtodatePipe } from './pipes/stringtodate.pipe';
import {AuthGuard} from "./guards/auth.guard";
import { NbMenuService, NbSidebarService, NbThemeModule} from '@nebular/theme';
import {StateService} from "./services/state.service";
import {NbMenuInternalService} from "@nebular/theme/components/menu/menu.service";
import {DialogsModule} from "./dialogs/confirmDialog/dialogs.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { LogOutComponent } from './components/log-out/log-out.component';
import {DialogData} from "./dialogs/dialogData/dialog-data";
import {ToasterModule} from "angular2-toaster";
import { FormDisabledConditiionDirective } from './directives/form-disabled-conditiion.directive';
import { StringFilterPipe } from './pipes/string-filter.pipe';
import { MainComponent } from './components/main/main.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogData,
    EditTestNameDialog,
    EditQuestionDialog,
    FourOhFourPage,
    StringtodatePipe,
    LogOutComponent,
    FormDisabledConditiionDirective,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    ToasterModule,
    ImportsModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NgbModule.forRoot(),
    DialogsModule,
  ],
  entryComponents: [
    DialogData,
    EditTestNameDialog,
    EditQuestionDialog,
  ],
  providers: [
    AuthenticateService,
    DataManagementService,
    LoginGuard,
    AuthGuard,
    NbSidebarService,
    NbMenuService,
    NbMenuInternalService,
    StateService,
    DataEmitterService,
    {provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true,},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true,},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

