import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginGuard} from "../guards/login.guard";
import {FourOhFourPage} from "../components/404-page/404-page.component";
import {AuthGuard} from "../guards/auth.guard";
import {LogOutComponent} from "../components/log-out/log-out.component";
import {MainComponent} from "../components/main/main.component";
import {RouterOutletComponent} from "../components/router-outlet/router-outlet.component";
import {AuthLoginComponent} from "../components/auth/login/login.component";
import {AuthComponent} from "../components/auth/auth/auth.component";
import {RegisterComponent} from "../components/auth/register/register.component";

const routes: Routes = [
    //General
    { path: '', component: RouterOutletComponent },
    {
        path: 'auth',
        component: AuthComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', component: AuthLoginComponent },
            { path: 'login', component: AuthLoginComponent },
            { path: 'register', component: RegisterComponent },
        ],

    },
    { path: 'app',
        component: MainComponent,
        canActivate:[AuthGuard],
        children:[

            { path: 'home', loadChildren: '../components/home/home.module#HomeModule'/**/ },

            //User
            { path: 'user/sign-out', component: LogOutComponent },
            { path: 'user/tests', loadChildren: '../components/user-tests/user-tests.module#UserTestsModule' },//List of tests
            { path: 'user/allocated-tests', loadChildren: '../components/user-allocated-tests/user-allocated-tests.module#UserAllocatedTestsModule' },//List of tests
            { path: 'user/test/selected/:testId', loadChildren: '../components/user-test-selected/user-test-selected.module#UserTestSelectedModule' },//The edit/result menu of a users view (shows attempts on this test, its settings, etc
            { path: 'user/test/live/:testId', loadChildren: '../components/live-test/live-test.module#LiveTestModule' },//Live attempt page of test
            { path: 'user/profile', loadChildren: '../components/user-profile/user-profile.module#UserProfileModule' },
            { path: 'user/browse', loadChildren: '../components/test-browser/test-browser.module#TestBrowserModule' },
            { path: 'user/groups', loadChildren: '../components/group-browser/group-browser.module#GroupBrowserModule' },
            { path: 'user/groups/add', loadChildren: '../components/group/group.module#GroupModule' },
            //{ path: 'user/test/edit/:testId', loadChildren: '../components/edit-test/edit-test.module#EditTestModule' },//Users cant edit tests unless specified
            //{ path: 'user/test/result/:testId', loadChildren: '../components/result/result.module#ResultModule' },//feedback/marks for 1 test

            //Author
            { path: 'author/tests', loadChildren: '../components/test-manager/test-manager.module#TestManagerModule' },//List, will link out to create and result
            { path: 'author/create', loadChildren: '../components/create-test/create-test.module#CreateTestModule' },
            { path: 'author/review/:testId', loadChildren: '../components/author-test-review/author-test-review.module#AuthorTestModule' },
            { path: 'author/edit/:testId', loadChildren: '../components/modify-test/modify-test.module#ModifyTestModule' },


            //Misc
            { path: '404', component: FourOhFourPage },
            { path: '**', redirectTo: '404' },
            { path: '', redirectTo: '/home', pathMatch: 'full' },
        ]
    },
    { path: '404', component: FourOhFourPage },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})

export class AppRouterModule { }