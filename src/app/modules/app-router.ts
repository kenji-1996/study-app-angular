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
    { path: 'tests/my-tests', component: CreateTestComponent, canActivate:[AuthGuard] },
    { path: 'tests/manager', loadChildren: '../components/test-manager/test-manager.module#TestManagerModule', canActivate:[AuthGuard] },
    { path: 'tests/selected/:testId', loadChildren: '../components/test/test.module#TestModule', canActivate:[AuthGuard] },
    { path: 'tests/live/:testId', loadChildren: '../components/live-test/live-test.module#LiveTestModule', canActivate:[AuthGuard] },
    { path: 'tests/edit/:testId', loadChildren: '../components/edit-test/edit-test.module#EditTestModule', canActivate:[AuthGuard] },
    { path: 'tests/result/:testId', loadChildren: '../components/result/result.module#ResultModule', canActivate:[AuthGuard] },
    { path: '404', component: FourOhFourPage },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})

export class AppRouterModule { }