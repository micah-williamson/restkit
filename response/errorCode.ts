import {Reflect} from '../';

export function ErrorCode(code: number) {
  return function(obj: any, key: string) {
    Reflect.defineMetadata('ErrorCode', code, obj, key);
  }
}