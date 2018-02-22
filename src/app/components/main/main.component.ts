import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, NgModule, OnDestroy, OnInit} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {fadeAnimate} from "../../misc/animation";
import {MENU_ITEMS} from "../menu";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/delay';
import { ToasterConfig, ToasterService} from "angular2-toaster";
import {DataEmitterService} from "../../services/data-emitter.service";
import {AuthenticateService} from "../../services/authenticate.service";
import {MatSnackBar} from "@angular/material";
import {Router,  Routes} from "@angular/router";
import {StateService} from "../../services/state.service";
import {
    NbMediaBreakpoint, NbMediaBreakpointsService, NbMenuService, NbSidebarService,
    NbThemeService
} from "@nebular/theme";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
    animations: [ fadeAnimate ],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewChecked {

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
    config: ToasterConfig;
    title = 'DIGITALSTUDY';
    userMenu = [{ title: 'Profile', link: '/app/user/profile' }, { title: 'Log out', link: '/app/user/sign-out' }];
    logged = false;
    width;
    height;
    open = 'true';


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
                protected sidebarService: NbSidebarService,
                private toasterService: ToasterService
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
        this.logged = this.auth.localLoggedIn();
        this.dataEmit.$loggedIn.subscribe(data => { this.logged = data;});
        this.$photo.subscribe(value => { this.photo = value; });
        this.$name.subscribe(value => { this.name = value; });

        this.config = new ToasterConfig({
            positionClass: 'toast-top-left',
            timeout: 5000,
            newestOnTop: true,
            tapToDismiss: true,
            preventDuplicates: false,
            animation: 'fade',
            limit: 5,
        });
    }

    ngAfterViewChecked() {
        if(this.auth.localLoggedIn()) {
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

@NgModule({
    declarations: [MainComponent],
    imports: []
})
export class MainComponentModule {

}