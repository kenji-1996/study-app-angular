import {EventEmitter, Injectable} from '@angular/core';
import {Result} from "../objects/objects";

@Injectable()
export class DataEmitterService {

  public $updateArray: EventEmitter<any>;
  public $loggedIn: EventEmitter<Boolean>;
  public $results: EventEmitter<Result[]>

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

  public pushResults(results:Result[]) {
    this.$results.emit(results);
  }

}
