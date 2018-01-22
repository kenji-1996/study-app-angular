import {EventEmitter, Injectable} from '@angular/core';
import {Result} from "../objects/objects";

@Injectable()
export class DataEmitterService {

  public $updateArray: EventEmitter<any>;
  public $pushTestResult: EventEmitter<any>;
  public $loggedIn: EventEmitter<Boolean>;
  public $results: EventEmitter<Result[]>;
  public $dirty: EventEmitter<boolean>;
  public $testSearchString: EventEmitter<any>;

  constructor() {
    this.$updateArray = new EventEmitter();
    this.$pushTestResult = new EventEmitter();
    this.$loggedIn = new EventEmitter();
    this.$results = new EventEmitter();
    this.$dirty = new EventEmitter();
    this.$testSearchString = new EventEmitter();
  }

  public pushDirty(item:boolean) {
    this.$dirty.emit(item);
  }

  public pushUpdateArray(item:any) {
    this.$updateArray.emit(item);
  }

  public pushLoggedIn(item:boolean) {
     this.$loggedIn.emit(item);
  }

  public pushTestSearchString(item:any) {
    this.$testSearchString.emit(item);
  }

  public pushTestResult(item:any) {
    this.$pushTestResult.emit(item);
  }

  public pushResults(results:Result[]) {
    this.$results.emit(results);
  }

}
