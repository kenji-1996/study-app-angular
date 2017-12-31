import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../components/home/home.component";
import {UserComponent} from "../components/user/user.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user', component: UserComponent },
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