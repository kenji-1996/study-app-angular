import { Component, OnInit } from '@angular/core';
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
  selector: 'app-keyword-question',
  templateUrl: './keyword-question.component.html',
  styleUrls: ['./keyword-question.component.scss']
})
export class KeywordQuestionComponent implements OnInit {

  answer;

  constructor(
      private dataEmit: DataEmitterService
  ) { }

  ngOnInit() {

  }

  onSubmit() { this.dataEmit.pushAnswer(this.answer);this.answer = ''; }

}