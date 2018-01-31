import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {Observable} from "rxjs/Observable";
import {allocatedTest, newQuestion, Question, submittedTest, TestToQuestion} from "../../objects/objects";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import * as global from '../../globals';
import {DataManagementService} from "../../services/data-management.service";
import {Subscription} from "rxjs/Subscription";
import {DataEmitterService} from "../../services/data-emitter.service";
import {Title} from "@angular/platform-browser";
import {fadeAnimate} from "../../misc/animation";
import {SearchPipe} from "../../pipes/search.pipe";
import {EditTestComponent} from "../edit-test/edit-test.module";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {DialogsService} from "../../services/dialogs.service";
import {ConfirmChangesGuard} from "../../guards/confirm-changes.guard";
import {NgbCheckBox} from "@ng-bootstrap/ng-bootstrap";
import {NbCheckboxModule} from "@nebular/theme";

@Component({
  selector: 'app-user-selected-test',
  templateUrl: './user-test-selected.component.html',
  styleUrls: ['./user-test-selected.component.scss'],
  animations: [ fadeAnimate ],
})
export class UserTestSelectedComponent implements OnInit {


  //Test variables
  allocatedTest: allocatedTest;
  submittedTests: submittedTest[];
  started = false;
  progress = '0';
  timerMax = '30';
  selectedQuestion;
  selectedId = 0;
  answer;
  timeLeft = 0;
  query;

  //Test options
  giveHint = false;
  timeLimit = false;
  instantResult = false;
  fullPage = false;
  randomOrder = false;//To-do1

  //Format
  isCollapsed = true;
  today: Date = new Date(Date.now());

  //Recent results
  private subscription: Subscription;
  constructor(
      private activeRoute: ActivatedRoute,
      private route: Router,
      private dataManagement: DataManagementService,
      private databaseManagementService: DataManagementService,
      public dataEmitter: DataEmitterService,
      private titleService: Title,
      private dialogsService: DialogsService,
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(allocatedTestResult => {
        this.allocatedTest = allocatedTestResult.data;
        //Check here if expired/attempts past due etc
        if(this.allocatedTest.test.expire && Date.now() > new Date(this.allocatedTest.test.expireDate).getTime()) { alert('test expired'); }// TODO: do something with expired test
        if(this.allocatedTest.test.attemptsAllowed != 0 && this.allocatedTest.test.attemptsAllowed >= this.allocatedTest.submittedTests.length) { alert('no attempts left'); }
        this.titleService.setTitle(this.allocatedTest.test.title + ' test - DigitalStudy');
        this.populateSubmitted();
      });
    });
  }


  canDeactivate(): Observable<boolean> | boolean {
    /*if (!this.dirty) {
      return true;
    }
    return this.dialogsService.confirm('Unsaved test', 'You have unsaved changes, are you sure you want to leave this page?');*/
    return true;
  }

  testStarted() {
    this.route.navigate( ['user/test/live', this.allocatedTest._id]);//, {queryParams: { giveHint:this.giveHint,timeLimit: this.timeLimit? this.timerMax : 0,instantResult: this.instantResult,questionId:this.selectedId }});
  }

  populateSubmitted() {
    this.dataManagement.getDATA(global.url + '/api/users/' + JSON.parse(localStorage.getItem('userObject'))._id + '/results/' + this.allocatedTest.test._id).subscribe(dataResult=> {
      if(!this.isEmptyObject(dataResult.data)) {
        this.submittedTests = dataResult.data.submittedTests;
      }
    });
  }

  daysBetween( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60;//*24; remove last part to get hours

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = new Date(date2).getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms/one_day);
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  /*
  setMyClasses(result:any) {
    let percent = parseInt(result);
    let styles;
    switch (true)
    {
      case percent <= 30:
        styles = {

          'color': 'red',
        };
        return 'btn  btn-block btn-hero-danger';
      case percent <= 60:
        styles = {

          'color': 'orange',
        };
        return 'btn  btn-block btn-hero-warning';
      case percent <= 80:
        styles = {

          'color': 'yellow',
        };
        return 'btn  btn-block btn-hero-info';
      case percent > 80:
        styles = {
          'color': 'green',
        };
        return 'btn  btn-block btn-hero-success';
      default:
    }
  }

  setMyStyles(result:any) {
    let percent = parseInt(result);
    let styles;
    switch (true)
    {
      case percent <= 30:
        styles = {

          'color': 'red',
        };
        return styles;
      case percent <= 60:
        styles = {

          'color': 'orange',
        };
        return styles;
      case percent <= 80:
        styles = {

          'color': 'yellow',
        };
        return styles;
      case percent > 80:
        styles = {
          'color': 'green',
        };
        return styles;
      default:
    }

  }
  */

}
@NgModule({
  declarations: [
    UserTestSelectedComponent,
    SearchPipe,
    EditTestComponent,
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: UserTestSelectedComponent, pathMatch: 'full', canDeactivate: [ConfirmChangesGuard]}
    ]),
    ImportsModule,
    InfiniteScrollModule,
    NbCheckboxModule,
  ],
  providers: [
    ConfirmChangesGuard,
  ]
})
export class UserTestSelectedModule {

}

