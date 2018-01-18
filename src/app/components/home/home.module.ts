import {AfterViewInit, Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthenticateService} from '../../services/authenticate.service';
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {ImportsModule} from "../../modules/imports.module";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-user',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name;
  idtoken;
  staff = false;

  constructor(
              public auth: AuthenticateService,
              private route: Router,
              private titleService: Title,
  ) {  }

  ngOnInit() {
    this.titleService.setTitle('Home - DigitalStudy');
    this.name = JSON.parse(localStorage.getItem('userObject')).name;
    this.idtoken = localStorage.getItem('idtoken');
    if(JSON.parse(localStorage.getItem('userObject')).permissions >= 3) {
      this.staff = true;
    }
  }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class HomeModule {

}

