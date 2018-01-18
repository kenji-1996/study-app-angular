import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "../components/login/login.component";
import {AuthGuard} from "../guards/auth.guard";
import {FourOhFourPage} from "../components/404-page/404-page.component";

const routes: Routes = [
    { path: '', component: LoginComponent, canActivate:[AuthGuard] },
    { path: 'home', loadChildren: '../components/home/home.module#HomeModule' },
    { path: 'tests/manager', loadChildren: '../components/test-manager/test-manager.module#TestManagerModule' },
    { path: 'tests/selected/:testId', loadChildren: '../components/test/test.module#TestModule' },
    { path: 'tests/live/:testId', loadChildren: '../components/live-test/live-test.module#LiveTestModule' },
    { path: 'tests/edit/:testId', loadChildren: '../components/edit-test/edit-test.module#EditTestModule' },
    { path: 'tests/result/:testId', loadChildren: '../components/result/result.module#ResultModule' },
    { path: '404', component: FourOhFourPage },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})

export class AppRouterModule { }