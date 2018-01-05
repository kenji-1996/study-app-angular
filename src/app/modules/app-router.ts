import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../components/home/home.component";
import {TempComponent} from "../components/temp/temp.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'temp', component: TempComponent },
    { path: 'user', loadChildren: '../components/user/user.module#UserModule' },
    { path: 'test-manager', loadChildren: '../components/test-manager/test-manager.module#TestManagerModule' },
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