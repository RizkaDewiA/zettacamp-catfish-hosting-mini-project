import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currReplace'
})
export class CurrReplacePipe implements PipeTransform {

  transform(value: any): any {
    value = value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    value = value?.replace(value, "Rp " + value);
    // console.log(value);
    
    return value
  }

}
