import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "../components/login/login.component";
import {LoginGuard} from "../guards/login.guard";
import {FourOhFourPage} from "../components/404-page/404-page.component";
import {AuthGuard} from "../guards/auth.guard";
import {CreateTestComponent} from "../components/create-test/create-test.component";

const routes: Routes = [
    { path: '', component: LoginComponent, canActivate:[LoginGuard] },
    { path: 'home', loadChildren: '../components/home/home.module#HomeModule', canActivate:[AuthGuard] },

    //User
    { path: 'user/tests', loadChildren: '../components/user-tests/user-tests.module#UserTestsModule', canActivate:[AuthGuard] },//List of tests
    { path: 'user/test/selected/:testId', loadChildren: '../components/test/test.module#TestModule', canActivate:[AuthGuard] },//The edit/result menu of a users view (shows attempts on this test, its settings, etc
    { path: 'user/test/live/:testId', loadChildren: '../components/live-test/live-test.module#LiveTestModule', canActivate:[AuthGuard] },//Live attempt page of test
    { path: 'user/test/edit/:testId', loadChildren: '../components/edit-test/edit-test.module#EditTestModule', canActivate:[AuthGuard] },//Users cant edit tests unless specified
    { path: 'user/test/result/:testId', loadChildren: '../components/result/result.module#ResultModule', canActivate:[AuthGuard] },//feedback/marks for 1 test

    //Author
    { path: 'author/tests', loadChildren: '../components/test-manager/test-manager.module#TestManagerModule', canActivate:[AuthGuard] },//List, will link out to create and result
    { path: 'author/create', component: CreateTestComponent,  canActivate:[AuthGuard] },
    { path: 'author/result/:testId', component: CreateTestComponent,  canActivate:[AuthGuard] },//Author marks/provides feedback on tests they made/are assigned,gets ID from author/tests
    { path: 'author/edit/:testId', component: CreateTestComponent,  canActivate:[AuthGuard] },

    //Misc
    { path: '404', component: FourOhFourPage },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})

export class AppRouterModule { }