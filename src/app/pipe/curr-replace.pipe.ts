import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currReplace'
})
export class CurrReplacePipe implements PipeTransform {

  transform(value: any): any {
    value = value.replace(/,/g, '.');
    return value;
  }

}
