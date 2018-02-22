import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RequestMethod} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataManagementService {

    constructor(
        private http: HttpClient,
    ) { }

    getDATA(url:string, header?:any):any {
        return this.http.get(url,header? {headers: new HttpHeaders(header)} : {});
    }

    postDATA(url:string,body:any):any {
        return this.http.post(url, body).map(x => x);
    }

    deleteDATA(url:string,body:any):any {
        return this.http.delete(url, body).map(x => x);
    }

    putDATA(url:string,body:any):any {
        return this.http.put(url, body).map(x => x);
    }
}
