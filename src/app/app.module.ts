import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import {AppRouterModule} from "./modules/app-router";
import { HomeComponent } from './components/home/home.component';

import { CookieService } from 'ngx-cookie-service';
import {AuthenticateService} from "./services/authenticate.service";
import {HttpClientModule} from "@angular/common/http";
import { UserComponent } from './components/user/user.component';
import {DataManagementService} from "./services/data-management.service";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    HttpClientModule
  ],
  providers: [
    CookieService,
    AuthenticateService,
    DataManagementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
