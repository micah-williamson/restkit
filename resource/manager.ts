import {fatal} from '../error';

export class IResolver {
  public name: string;

  public object: any;

  public method: string;
}

export class ResolutionManager {
  public static resolvers: IResolver[] = [];

  /**
   * @description Registers the given authentication handler
   * @param {AuthenticationHandler} handler [description]
   */
  public static registerResolver(resolver: IResolver) {
    let namedResolver = this.getResolverByName(resolver.name);

    if(namedResolver) {
      fatal(new Error(`Unable to register resolver at ${resolver.object.prototype.constructor.name}.${resolver.method} with the name '${resolver.name}'. ${namedResolver.object.prototype.constructor.name}.${namedResolver.method} has already been registered with this name.`));
    }

    this.resolvers.push(resolver);
  }

  /**
   * @Description Returns the authentication handler by name
   * @param  {string}                 nm [description]
   * @return {AuthenticationHandler}    [description]
   */
  public static getResolverByName(nm: string): IResolver {
    let resolver: IResolver = null;

    this.resolvers.forEach((res) => {
      if(res.name === nm) {
        resolver = res;
      }
    });

    return resolver;
  }
}