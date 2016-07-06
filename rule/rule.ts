import {Reflect} from '../reflect';

export function Rule(... ruleNames: string[]) {
  return function(object: any, method: string) {
    let rules = Reflect.getMetadata('Rules', object, method) || [];
    rules.push(ruleNames);

    Reflect.defineMetadata('Rules', rules, object, method);
  }
}