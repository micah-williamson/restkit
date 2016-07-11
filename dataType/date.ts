import {DTOManager} from '../dto';

import {DataType} from './dataType';

export class DateDataType extends DataType<Date> {
  private datetimeRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-./])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;

  type: Date;

  canCast(val: any): boolean {
    if(typeof val === 'string') {
      return this.datetimeRegex.test(val);
    } else if(val instanceof Date) {
      return true;
    }

    return false;
  }

  cast(val: any): Date {
    return val;
  }
}

DTOManager.registerDataType(new DateDataType());