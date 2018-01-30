import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, NgZone, OnDestroy, OnInit} from '@angular/core';
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
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked{

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
  userMenu = [{ title: 'Profile' }, { title: 'Log out', link: '/user/sign-out' }];
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
              private cdRef:ChangeDetectorRef,
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

  ngAfterViewChecked() {
    if(this.logged) {
      this.$photo.emit(JSON.parse(localStorage.getItem('userObject')).picture);
      this.$name.emit(JSON.parse(localStorage.getItem('userObject')).name);
    }
    this.cdRef.detectChanges();
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.layoutState$.unsubscribe();
    this.sidebarState$.unsubscribe();
    this.menuClick$.unsubscribe();
  }
}


