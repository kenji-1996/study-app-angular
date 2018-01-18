import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringtodate'
})
export class StringtodatePipe implements PipeTransform {

  transform(value: string): Date {
    let reggie = /(\d{4})-(\d{2})-(\d{2})/;
    let dateArray = reggie.exec(value);
    let dateObject = new Date(
        (+dateArray[1]),
        ((+dateArray[2])) - 1, // Careful, month starts at 0!
        (+dateArray[3])
    );
    return dateObject;
  }

}
