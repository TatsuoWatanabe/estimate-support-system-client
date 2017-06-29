import { Pipe, PipeTransform } from '@angular/core';
import { MsgCodes }            from '../consts/msg-codes';
/**
 * Transform msgCode to message.
 */
@Pipe({name: 'msgCode'})
export class MsgCodePipe implements PipeTransform {
  transform(code: any): string {
    // for string.
    if (typeof code === 'string') {
      return MsgCodes[code];
    }
    // for array.
    if (Array.isArray(code)) {
      const arr = code.copyWithin(0, 0);
      const cd  = arr.shift();
      const fn  = MsgCodes[cd];
      return fn.apply(undefined, arr);
    }
  }
}
