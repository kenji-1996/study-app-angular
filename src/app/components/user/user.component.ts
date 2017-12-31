import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticateService} from "../../services/authenticate.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  name;

  constructor(private cookieService: CookieService,
              public auth: AuthenticateService,
              private route: Router) { }

  ngOnInit() {
    this.name = this.cookieService.get('name');
  }


  public handleLogOut() {
    this.auth.revoke();
    this.route.navigate(['/']);
  }

}
