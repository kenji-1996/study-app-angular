import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticateService} from '../../services/authenticate.service';
import {CookieService} from 'ngx-cookie-service';
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';

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

  constructor(private cookieService: CookieService,
              public auth: AuthenticateService,
              private route: Router,
              private data: DataManagementService
  ) { }

  ngOnInit() {
    this.name = this.cookieService.get('name');
    this.idtoken = this.cookieService.get('idtoken');
    this.questions = this.cookieService.get('questions');
    var body = { idtoken : this.idtoken, action: 'get', limit: '1'/*, type: 'list'*/ };
    this.data.postDATA(global.url + '/api/question', body).subscribe(dataResult=> {
      this.latestQuestion = dataResult;
      console.log(dataResult[0].question);
    });
  }

  ngAfterViewInit() {

  }


  public handleLogOut() {
    this.auth.revoke();
    this.route.navigate(['/']);
  }

}
