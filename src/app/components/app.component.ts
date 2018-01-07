import {Component, OnInit} from '@angular/core';
import {AuthenticateService} from "../services/authenticate.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  photo = new BehaviorSubject("https://i.imgur.com/7OGK7HA.jpg");

  title = 'DigitalStudy.io';
  constructor(private auth: AuthenticateService) {
    this.auth.initAuth();
  }

  printAvatar() {
    console.log(this.photo);
  }

  ngOnInit() {
    if(localStorage.getItem('avatar')) {
      this.photo.next(localStorage.getItem('avatar'));
    }
    this.photo.subscribe(value => {
      console.log(value);
    })
  }
}


