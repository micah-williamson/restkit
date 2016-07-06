import {Reflect} from '../reflect';
import {Response, ResponseService} from '../response';

import {Injection, IInjectable, IInjectionConfig, IInjectionResolver} from './';

export class InjectorService {

  public static registerInjection(object: any, method: any, injectionConfig: IInjectionConfig) {
    let injection = <Injection>Reflect.getMetadata('Injection', object, method) || [];

    injection.push(injectionConfig);

    Reflect.defineMetadata('Injection', injection, object, method);
  }

  public static run(object: any, method: any, context: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      let injection = <Injection>Reflect.getMetadata('Injection', object, method) || [];

      this.resolveInjection(injection, context).then((response: Response) => {
        if(ResponseService.isError(response)) {
          throw response;
        }
        
        let methodResult = object[method].apply(object, response);

        if(methodResult instanceof Promise) {
          return methodResult;
        } else {
          return Promise.resolve(methodResult);
        }
      }).catch((response: any) => {
        reject(ResponseService.convertErrorResponse(response, object, method));        
      }).then((response: any) => {
        if(ResponseService.isSuccess(response)) {
          resolve(ResponseService.convertSuccessResponse(response, object, method));
        } else {
          reject(ResponseService.convertErrorResponse(response, object, method));
        }
      });
    });
  }

  public static resolveInjection(injection: Injection, context: any): Promise<any> {
    let returnPromises: Promise<any>[] = [];

    injection.forEach((injectionConfig) => {
      returnPromises[injectionConfig.injectable.index] = injectionConfig.injectionResolver.resolve(injectionConfig.injectable, context)
    });

    return Promise.all(returnPromises).then((values: any[]) => {
      let returnValues: any[] = [];
      values.forEach((value) => {
        if(value instanceof Response) {
          returnValues.push(value.data);
        } else {
          returnValues.push(value);
        }
      });

      return returnValues;
    });
  }

}