import {DTOManager} from '../dto';

import {DataType} from './dataType';

export class ArrayDataType extends DataType<Array<any>> {
  type: Array<any>;

  canCast(val: any): boolean {
    return val instanceof Array;
  }

  cast(val: any): Array<any> {
    return val;
  }
}

DTOManager.registerDataType(new ArrayDataType());