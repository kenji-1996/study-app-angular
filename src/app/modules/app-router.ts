import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../components/home/home.component";
import {AuthGuard} from "../guards/auth.guard";
import {FourOhFourPage} from "../components/404-page/404-page.component";

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate:[AuthGuard] },
    { path: 'user', loadChildren: '../components/user/user.module#UserModule' },
    { path: 'tests/manager', loadChildren: '../components/test-manager/test-manager.module#TestManagerModule' },
    { path: 'tests/selected/:testId', loadChildren: '../components/test/test.module#TestModule' },
    { path: 'tests/edit/:testId', loadChildren: '../components/edit-test/edit-test.module#EditTestModule' },
    { path: '404', component: FourOhFourPage },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})

export class AppRouterModule { }