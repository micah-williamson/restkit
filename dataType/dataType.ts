export abstract class DataType<T> {
  type: any;

  abstract canCast(val: any): boolean;

  abstract cast(val: any): T;
}