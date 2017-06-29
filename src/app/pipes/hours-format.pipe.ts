import { Pipe, PipeTransform } from '@angular/core';
import { CommonUtil } from '../util/common-util';


/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'hoursFormat'})
export class HoursFormatPipe implements PipeTransform {
  transform(num: any) {
    return CommonUtil.hoursFormat(num);
  }
}
