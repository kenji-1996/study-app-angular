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
import {NgIfMediaQuery} from "./misc/media-query-directive";
import {EditTestDialog} from "./dialogs/editTest/edit-test.component";
import {AuthGuard} from "./guards/auth.guard";
import { NbMenuService, NbSidebarService, NbThemeModule} from '@nebular/theme';
import {StateService} from "./services/state.service";
import {NbMenuInternalService} from "@nebular/theme/components/menu/menu.service";
import {DialogsModule} from "./dialogs/confirmDialog/dialogs.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";


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
    NbThemeModule.forRoot({ name: 'default' }),
    NgbModule.forRoot(),
    DialogsModule,
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
    NbSidebarService,
    NbMenuService,
    NbMenuInternalService,
    StateService,
    DataEmitterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

