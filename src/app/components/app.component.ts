import {Component, HostListener, NgZone, OnInit} from '@angular/core';
import {AuthenticateService} from "../services/authenticate.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DataEmitterService} from "../services/data-emitter.service";
import {MatSnackBar} from "@angular/material";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  photo = new BehaviorSubject("https://i.imgur.com/7OGK7HA.jpg");
  title = 'DigitalStudy.io';
  logged = false;
  width;
  height;
  mode:string = 'side';
  open = 'true';

  constructor(private auth: AuthenticateService,
              public dataEmit: DataEmitterService,
              public snackBar: MatSnackBar,
              public route: Router,
              public ngZone:NgZone
  ) {
    this.auth.initAuth();
    this.logged = this.auth.localLoggedIn();
    this.dataEmit.$loggedIn.subscribe(data => { this.logged = data;});
    dataEmit.$updateArray.subscribe(data => { this.snackBar.open(data, 'close', { duration: 2000 }); });
    this.changeMode();
    window.onresize = (e) => {
      ngZone.run(() => {
        this.changeMode();
      });
    };
  }

  changeMode() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if(this.width <= 800) {
      this.mode = 'over';
      this.open = 'false';
    }
    if(this.width > 680) {
      this.mode = 'side';
      this.open = 'true';
    }
  }

  public handleLogOut() {
    this.auth.revoke();
    this.route.navigate(['/']);
  }

  ngOnInit() {
    if(this.logged) {
      this.photo.next(JSON.parse(localStorage.getItem('userObject')).picture);
    }
    this.photo.subscribe(value => {
      console.log(value);
    })
  }
}


