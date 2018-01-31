import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {RequestMethod} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataManagementService {

  constructor(
      private http: HttpClient,
  ) { }

  getDATA(url:string):any {
    return this.http.get(url);
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
