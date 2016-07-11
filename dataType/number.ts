import {DTOManager} from '../dto';

import {DataType} from './dataType';

export class NumberDataType extends DataType<Number> {
  type: Number;

  canCast(val: any): boolean {
    return !isNaN(val);
  }

  cast(val: any): number {
    return Number(val);
  }
}

DTOManager.registerDataType(new NumberDataType());