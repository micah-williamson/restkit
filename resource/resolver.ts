import {IResolver, ResolutionManager} from './manager';

export function Resolver(name: string) {
  return function(object: any, method: string) {
    let resolver: IResolver = {
      name: name,
      object: object,
      method: method
    };

    ResolutionManager.registerResolver(resolver);
  }
}