import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class DataEmitterService {

  public $updateArray: EventEmitter<any>;
  public $loggedIn: EventEmitter<Boolean>;

  constructor() {
    this.$updateArray = new EventEmitter();
    this.$loggedIn = new EventEmitter();
  }

  public pushUpdateArray(item:any) {
    this.$updateArray.emit(item);
  }

  public pushLoggedIn(item:boolean) {
     this.$loggedIn.emit(item);
  }

}
