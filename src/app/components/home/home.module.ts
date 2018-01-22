import { Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthenticateService} from '../../services/authenticate.service';
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {ImportsModule} from "../../modules/imports.module";
import {Title} from "@angular/platform-browser";
import {AddNewsComponent} from "../add-news/add-news.component";
import {fadeAnimate} from "../../misc/animation";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [ fadeAnimate ],
})
export class HomeComponent implements OnInit {
  name;
  idtoken;
  staff = false;
  news;

  constructor(
              public auth: AuthenticateService,
              private route: Router,
              private titleService: Title,
              private data: DataManagementService,
              private sanitizer: DomSanitizer,
  ) {  }

  ngOnInit() {
    this.titleService.setTitle('Home - DigitalStudy');
    this.name = JSON.parse(localStorage.getItem('userObject')).name;
    this.idtoken = localStorage.getItem('idtoken');
    if(JSON.parse(localStorage.getItem('userObject')).permissions >= 3) {
      this.staff = true;
    }
    this.data.getDATA(global.url + '/api/news').subscribe(dataResult=> {
      this.news = dataResult.data;
    });
  }
}

@NgModule({
  declarations: [HomeComponent, AddNewsComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full'}
    ]),
    ImportsModule,
    InfiniteScrollModule,
  ]
})
export class HomeModule {

}
