import {EventEmitter, Injectable} from '@angular/core';
import {testQuestion} from "../objects/objects";

@Injectable()
export class DataEmitterService {

  public $updateArray: EventEmitter<any>;
  public $loggedIn: EventEmitter<Boolean>;
  public $results: EventEmitter<testQuestion[]>

  constructor() {
    this.$updateArray = new EventEmitter();
    this.$loggedIn = new EventEmitter();
    this.$results = new EventEmitter();
  }

  public pushUpdateArray(item:any) {
    this.$updateArray.emit(item);
  }

  public pushLoggedIn(item:boolean) {
     this.$loggedIn.emit(item);
  }

  public pushResults(results:testQuestion[]) {
    this.$results.emit(results);
  }

}
