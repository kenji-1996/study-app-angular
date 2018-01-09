/**
 * Created by Kenji on 1/9/2018.
 */
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

export class AddHeaderInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header
        if(localStorage.getItem('idtoken')) {
            const clonedRequest = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('idtoken'))});
            // Pass the cloned request instead of the original request to the next handle
            return next.handle(clonedRequest);
        }
    }
}