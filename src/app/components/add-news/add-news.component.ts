import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";
import {DataEmitterService} from "../../services/data-emitter.service";
import {DataManagementService} from "../../services/data-management.service";
import * as global from '../../globals';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit {

  headline;
  content;
  separatorKeysCodes = [ENTER, COMMA];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  tags = [];

  constructor(private dataManagement: DataManagementService,
              public dataEmit: DataEmitterService,
  ) { }

  ngOnInit() {

  }
  //{headline: STRING, content: STRING, authorId: String, authorName: String, tags: [String]}
  submitNews() {
    if(!this.headline || !this.content) {
      this.dataEmit.pushUpdateArray('Cannot post news without headline or content.');
      return null;
    }
    var body =
        {
          headline: this.headline,
          content: this.content,
          authorId: JSON.parse(localStorage.getItem('userObject'))._id,
          authorName: JSON.parse(localStorage.getItem('userObject')).name,
          tags: this.tags
        };
    this.dataManagement.postDATA(global.url + '/api/news', body).subscribe(dataResult=> {
      if(dataResult) {
        this.dataEmit.pushUpdateArray(dataResult.message);
      }
    });
  }

  removeTag(word:any) {
    const index: number = this.tags.indexOf(word);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}
