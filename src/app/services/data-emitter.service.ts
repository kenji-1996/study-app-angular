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
  public $testAnswer: EventEmitter<any>;

  constructor() {
    this.$updateArray = new EventEmitter();
    this.$pushTestResult = new EventEmitter();
    this.$loggedIn = new EventEmitter();
    this.$results = new EventEmitter();
    this.$dirty = new EventEmitter();
    this.$testSearchString = new EventEmitter();
    this.$testAnswer = new EventEmitter();
  }

  public pushAnswer(answer:any) {
    this.$testAnswer.emit(answer);
  }

  public pushDirty(item:boolean) {
    this.$dirty.emit(item);
  }

  public pushUpdateArray(content?:any,title?:any,type?:any,timeout?:number) {
    let notificationArray = [];
    if(content) {notificationArray.push(content);}
    if(title) {notificationArray.push(title);}
    if(type) {notificationArray.push(type);}
    if(timeout) {notificationArray.push(timeout);}
    this.$updateArray.emit(notificationArray);
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
