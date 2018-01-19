import { Component, OnInit, NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {fadeAnimate} from "../../misc/animation";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  animations: [ fadeAnimate ],
})
export class ResultComponent implements OnInit {

  //Not using this yet, may remove in future
  constructor() { }

  result;
  test;
  percentResult;
  mark;

  ngOnInit() {
    let resultJSON = JSON.parse(localStorage.getItem('result'));
    this.test = resultJSON[0].test;
    this.result = resultJSON[0].result;
    this.percentResult = resultJSON[0].percentResult;
    this.mark = resultJSON[0].mark;
  }

}
@NgModule({
  declarations: [ResultComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: ResultComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class ResultModule {

}