import {DTOManager} from '../dto';

import {DataType} from './dataType';

export class ObjectDataType extends DataType<Object> {
  type: Object;

  canCast(val: any): boolean {
    return val instanceof Object;
  }

  cast(val: any): Object {
    return val;
  }
}


DTOManager.registerDataType(new ObjectDataType());