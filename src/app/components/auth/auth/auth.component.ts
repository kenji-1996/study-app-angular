import {Component, NgModule, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {ImportsModule} from "../../../modules/imports.module";
import {LoginComponent} from "../login/login.component";
import {Register} from "ts-node/dist";
import {RegisterComponent} from "../register/register.component";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


@NgModule({
    declarations: [AuthComponent],
    imports: [
        RouterModule.forChild([
            { path: '', component: LoginComponent, pathMatch: 'full'},
            { path: 'login', component: LoginComponent, pathMatch: 'full'},
            { path: 'register', component: RegisterComponent, pathMatch: 'full'},
        ]),
        ImportsModule,
    ]
})
export class AuthModule {

}

