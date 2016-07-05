import {InjectorService} from '../injector';
import {IInjectable, IInjectionConfig, IInjectionResolver} from '../injector';
import {Response, ResponseService} from '../response';
import {IResolver, ResolutionManager} from './manager';
import {fatal} from '../error';

export function Resource(name: string) {
  return function(object: any, method: string, index: number) {
    let injectable: IInjectable = {
      index: index,
      arguments: [name]
    };

    let injectionConfig: IInjectionConfig = {
      injectionResolver: new ResourceResolver(),
      injectable: injectable
    };

    InjectorService.registerInjection(object, method, injectionConfig);
  }
}

export class ResourceResolver implements IInjectionResolver {

  public resolve(injectable: IInjectable, request: any): Promise<any> {
    return new Promise((resolve, reject) => { 
      let name = injectable.arguments[0];
      let resolver: IResolver;

      resolver = ResolutionManager.getResolverByName(name);

      InjectorService.run(resolver.object, resolver.method, request).then((response: Response) => {
          if(response instanceof Response && ResponseService.isError(response)) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch((response: any) => {
          reject(ResponseService.convertErrorResponse(response));
        });
    });
  }

}