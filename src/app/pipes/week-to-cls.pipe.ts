import { Pipe, PipeTransform } from '@angular/core';
/**
 * Transform ISO week date number to className.
 */
@Pipe({name: 'weekToCls'})
export class WeekToClsPipe implements PipeTransform {
  transform(num: any): string {
    const strNum = String(num);
    const className = strNum === '7' ? 'red-text'  :
                      strNum === '6' ? 'blue-text' : '';
    return className;
  }
}
