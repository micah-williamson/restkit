import {DTOManager} from '../dto';

import {DataType} from './dataType';

export class Integer {
  private value: number;

  constructor(val: number | string) {
    if(typeof val === 'string') {
      this.value = parseInt(val);
    } else {
      this.value = Number(val);
      this.value = Math.floor(this.value);
    }
  }

  public valueOf(): number {
    return this.value;
  }

  public toString(): string {
    return this.value.toString();
  }

  public static fromValue(val: any): Integer {
    return new Integer(val);
  }
}

export class IntegerDataType extends DataType<Integer> {
  type: Integer;

  canCast(val: any): boolean {
    return !isNaN(val);
  }

  cast(val: any): Integer {
    return new Integer(val);
  }
}

DTOManager.registerDataType(new IntegerDataType());