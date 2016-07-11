import {DTOManager} from '../dto';

import {DataType} from './dataType';

export class StringDataType extends DataType<String> {
  type: String;

  canCast(val: any): boolean {
    if(val instanceof Object || val instanceof Array) {
      return false;
    }

    return true;
  }

  cast(val: any): string {
    return String(val);
  }
}

DTOManager.registerDataType(new StringDataType());