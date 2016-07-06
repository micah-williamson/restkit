import {Reflect} from '../';

export function ResponseCode(code: number) {
  return function(obj: any, key: string) {
    Reflect.defineMetadata('ResponseCode', code, obj, key);
  }
}