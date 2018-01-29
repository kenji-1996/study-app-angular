import { Component, OnInit } from '@angular/core';
import {DataEmitterService} from "../../services/data-emitter.service";

@Component({
  selector: 'app-shortanswer-question',
  templateUrl: './shortanswer-question.component.html',
  styleUrls: ['./shortanswer-question.component.scss']
})
export class ShortanswerQuestionComponent implements OnInit {
  answer;
  constructor(
      private dataEmit: DataEmitterService
  ) { }

  ngOnInit() {
  }

  onSubmit() { this.dataEmit.pushAnswer(this.answer); }

}