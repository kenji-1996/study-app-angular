import {AfterViewInit, Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthenticateService} from '../../services/authenticate.service';
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {ImportsModule} from "../../modules/imports.module";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  name;
  idtoken;

  constructor(
              public auth: AuthenticateService,
              private route: Router
  ) {  }

  ngOnInit() {
    this.name = JSON.parse(localStorage.getItem('userObject')).name;
    this.idtoken = localStorage.getItem('idtoken');
  }
}

@NgModule({
  declarations: [UserComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: UserComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class UserModule {

}

