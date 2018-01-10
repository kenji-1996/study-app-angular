import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterModule} from "@angular/router";
import {ImportsModule} from "../../modules/imports.module";
import {Observable} from "rxjs/Observable";
import {Question, TestToQuestion} from "../../objects/test";
import 'rxjs/add/observable/of';
import * as global from '../../globals';
import {DataManagementService} from "../../services/data-management.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  test$: Observable<TestToQuestion>;
  constructor(
      private route: ActivatedRoute,
      private dataManagement: DataManagementService
  ) { }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      let testId = params['testId'];
      this.dataManagement.getDATA(global.url + '/api/tests/' + testId).subscribe(dataResult=> {
        console.log(dataResult.data);
        var questions:Array<Question> = [];
        let test = new TestToQuestion(dataResult.data[0]._id,dataResult.data[0].title,questions,dataResult.data[0].author);
        this.dataManagement.getDATA(global.url + '/api/tests/' + testId + '/questions').subscribe(dataResult=> {
          for(var i = 0; i < dataResult.data.length; i++) {
            questions.push(new Question(dataResult.data[i]._id,dataResult.data[i].question,dataResult.data[i].answer,dataResult.data[i].category));
          }
          this.test$ = Observable.of(test);
        });
      });
    });
  }

}
@NgModule({
  declarations: [TestComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: TestComponent, pathMatch: 'full'}
    ]),
    ImportsModule
  ]
})
export class TestModule {

}

