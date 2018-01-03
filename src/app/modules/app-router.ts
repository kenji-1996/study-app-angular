import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../components/home/home.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user', loadChildren: '../components/user/user.module#UserModule' },
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