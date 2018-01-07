import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class DataManagementService {

  constructor(
      private http: HttpClient,
  ) { }

  getDATA(url:string):any {
    return this.http.get(url, {
      headers: new HttpHeaders().set('Accept', 'q=0.8;application/json;q=0.9')
    }).map(x => x);
  }

  postDATA(url:string,body:any):any {
    return this.http.post(url, body).map(x => x);
  }
}
