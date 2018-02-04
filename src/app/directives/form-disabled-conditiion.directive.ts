import {FormControl} from "@angular/forms";
import { Input,Directive } from '@angular/core';

@Directive({
  selector: '[formControl][disableCond]'
})
export class FormDisabledConditiionDirective {
  @Input() formControl: FormControl;

  constructor() { }

  get disableCond(): boolean { // getter, not needed, but here only to completude
    return !!this.formControl && this.formControl.disabled;
  }

  @Input('disableCond') set disableCond(s: boolean) {
    if (!this.formControl) return;
    else if (s) this.formControl.disable();
    else this.formControl.enable();
  }
}