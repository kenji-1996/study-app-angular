import {Component, EventEmitter, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AuthenticateService} from "../services/authenticate.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DataEmitterService} from "../services/data-emitter.service";
import {MatSnackBar} from "@angular/material";
import {NavigationEnd, Router} from "@angular/router";
import {NavList} from "../objects/objects";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {fadeAnimate} from "../misc/animation";
import {Subscription} from "rxjs/Subscription";
import {
  NbMediaBreakpoint, NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService,
  NbThemeService
} from "@nebular/theme";
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/delay';
import {StateService} from "../services/state.service";
import {MENU_ITEMS} from "./menu";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  styleUrls: ['./app.component.scss'],
  animations: [ fadeAnimate ],
})
export class AppComponent implements OnInit, OnDestroy{

  menu = MENU_ITEMS;
  layout: any = {};
  sidebar: any = {};

  protected layoutState$: Subscription;
  protected sidebarState$: Subscription;
  protected menuClick$: Subscription;

  public $photo: EventEmitter<any> = new EventEmitter();
  public $name: EventEmitter<any> = new EventEmitter();
  photo;
  name;
  title = 'DIGITALSTUDY';
  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  logged = false;
  width;
  height;
  mode:string = 'side';
  open = 'true';
  navList: NavList[];


  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  constructor(private auth: AuthenticateService,
              public dataEmit: DataEmitterService,
              public snackBar: MatSnackBar,
              public route: Router,
              public ngZone:NgZone,
              protected stateService: StateService,
              protected menuService: NbMenuService,
              protected themeService: NbThemeService,
              protected bpService: NbMediaBreakpointsService,
              protected sidebarService: NbSidebarService
  ) {
    this.layoutState$ = this.stateService.onLayoutState()
        .subscribe((layout: string) => this.layout = layout);

    this.sidebarState$ = this.stateService.onSidebarState()
        .subscribe((sidebar: string) => {
          this.sidebar = sidebar;
        });

    const isBp = this.bpService.getByName('is');
    this.menuClick$ = this.menuService.onItemSelect()
        .withLatestFrom(this.themeService.onMediaQueryChange())
        .delay(20)
        .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {

          if (bpTo.width <= isBp.width) {
            this.sidebarService.collapse('menu-sidebar');
          }
        });
    this.auth.initAuth();
    this.logged = this.auth.localLoggedIn();
    this.dataEmit.$loggedIn.subscribe(data => { this.logged = data;});
    dataEmit.$updateArray.subscribe(data => { this.snackBar.open(data, 'close', { duration: 2000 }); });
    this.$photo.subscribe(value => { this.photo = value; });
    this.$name.subscribe(value => { this.name = value; });
  }



  public handleLogOut() {
    this.auth.revoke();
    this.route.navigate(['/']);
  }

  ngOnInit() {
    if(this.logged) {
      this.$photo.emit(JSON.parse(localStorage.getItem('userObject')).picture);
      this.$name.emit(JSON.parse(localStorage.getItem('userObject')).name);
    }
  }

  ngOnDestroy() {
    this.layoutState$.unsubscribe();
    this.sidebarState$.unsubscribe();
    this.menuClick$.unsubscribe();
  }
}

/*
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

 this.changeMode();
 window.onresize = (e) => {
 ngZone.run(() => {
 this.changeMode();
 });
 };

 */


