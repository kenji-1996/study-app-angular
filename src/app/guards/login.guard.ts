import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthenticateService} from "../services/authenticate.service";
import {DataEmitterService} from "../services/data-emitter.service";

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthenticateService,
        private dataEmitter: DataEmitterService
    ) {

    }
    canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
        if(!this.authService.localLoggedIn()) {
            return true;
        }
        this.dataEmitter.pushUpdateArray('Welcome ' + JSON.parse(localStorage.getItem('userObject')).name);
        this.router.navigate(['/home']);
        return false;
    }
}