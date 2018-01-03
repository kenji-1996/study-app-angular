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
export class UserComponent implements OnInit, AfterViewInit {
  name;
  idtoken;
  questions;
  latestQuestion;

  constructor(
              public auth: AuthenticateService,
              private route: Router,
              private data: DataManagementService
  ) {  }

  ngOnInit() {
    this.name = localStorage.getItem('name');
    this.idtoken = localStorage.getItem('idtoken');
    this.questions = localStorage.getItem('questions');
    var body = { idtoken : this.idtoken, action: 'get', limit: '1'/*, type: 'list'*/ };
    this.data.postDATA(global.url + '/api/question', body).subscribe(dataResult=> {
      if(!this.isEmptyObject(dataResult)) {
        this.latestQuestion = dataResult;
      }
    });
  }

  ngAfterViewInit() {

  }


  public handleLogOut() {
    this.auth.revoke();
    this.route.navigate(['/']);
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
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

