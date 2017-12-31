import { Component } from '@angular/core';
import {AuthenticateService} from "../services/authenticate.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'app';
  constructor(private auth: AuthenticateService) {
    this.auth.initAuth();
  }
}
