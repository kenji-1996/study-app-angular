import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../components/home/home.component";
import {AuthGuard} from "../guards/auth.guard";

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate:[AuthGuard] },
    { path: 'user', loadChildren: '../components/user/user.module#UserModule' },
    { path: 'test-manager', loadChildren: '../components/test-manager/test-manager.module#TestManagerModule' },
    { path: 'test/:testId', loadChildren: '../components/test/test.module#TestModule' },
    { path: 'edit-test/:testId', loadChildren: '../components/edit-test/edit-test.module#EditTestModule' },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})

export class AppRouterModule { }
/*{ path: 'portfolio',  component: ProjectsComponent },
 { path: 'resume',  component: ResumeComponent },
 { path: 'references', component: ReferencesComponent },*/