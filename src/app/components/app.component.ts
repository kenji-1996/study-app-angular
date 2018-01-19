import {Component, EventEmitter, NgZone, OnInit} from '@angular/core';
import {AuthenticateService} from "../services/authenticate.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DataEmitterService} from "../services/data-emitter.service";
import {MatSnackBar} from "@angular/material";
import {NavigationEnd, Router} from "@angular/router";
import {NavList} from "../objects/objects";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {fadeAnimate} from "../misc/animation";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  styleUrls: ['./app.component.scss'],
  animations: [ fadeAnimate ],
})
export class AppComponent implements OnInit{

  public $photo: EventEmitter<any> = new EventEmitter();
  photo;
  title = 'DIGITALSTUDY';
  logged = false;
  width;
  height;
  mode:string = 'side';
  open = 'true';
  navList: NavList[];

  constructor(private auth: AuthenticateService,
              public dataEmit: DataEmitterService,
              public snackBar: MatSnackBar,
              public route: Router,
              public ngZone:NgZone
  ) {
    this.navList = [
      { categoryName: 'User', icon: 'face', dropDown:false, subCategory:
          [
            { subCategoryName: 'Home', subCategoryLink:'/home', visable: true, },
            { subCategoryName: 'Profile', subCategoryLink:'/profile', visable: true, },
          ]
      },
      { categoryName: 'Tests', icon: 'question_answer', dropDown:true, subCategory:
          [
            { subCategoryName: 'Your list', subCategoryLink:'/tests/manager', visable: true, },
            { subCategoryName: 'Results', subCategoryLink:'/tests/results', visable: true, },
            { subCategoryName: 'Selected', subCategoryLink:'/tests/selected', visable: false, },
            { subCategoryName: 'Editing', subCategoryLink:'tests/edit', visable: false, },
          ]
      },
    ];
    this.auth.initAuth();
    this.logged = this.auth.localLoggedIn();
    this.dataEmit.$loggedIn.subscribe(data => { this.logged = data;});
    this.$photo.subscribe(value => { this.photo = value;console.log(this.photo); });
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
    if(this.width > 800) {
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
      this.$photo.emit(JSON.parse(localStorage.getItem('userObject')).picture);
    }
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        for(var i = 0; i < this.navList.length; i++) {
          this.navList[i].dropDown = false;
        }
        this.navList[1].subCategory[2].visable = false;
        this.navList[1].subCategory[3].visable = false;
        let path = event.url;
        switch (true)
        {
          case path.startsWith('/tests/manager'):
            this.navList[1].dropDown = true;
            break;
          case path.startsWith('/tests/selected'):
            this.navList[1].subCategory[2].visable = true;
            this.navList[1].dropDown = true;
            break;
          case path.startsWith('/tests/edit'):
            this.navList[1].subCategory[3].visable = true;
            this.navList[1].dropDown = true;
            break;
          case path.startsWith('/home'):
            this.navList[0].dropDown = true;
            break;
          default:
        }
      }
    });
  }
}


