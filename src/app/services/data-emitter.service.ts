import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class DataEmitterService {

  public $updateArray: EventEmitter<any>;

  constructor() {
    this.$updateArray = new EventEmitter();
  }

  public push(item:any) {
    this.$updateArray.emit(item);
  }

}
