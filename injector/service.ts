import {Reflect} from '../reflect';
import {Response, ResponseService} from '../response';

import {fatal} from '../';
import {Injection, IInjectable, IInjectionConfig, IInjectionResolver} from './';
import {Integer} from '../dto';

export class InjectorService {

  public static registerInjection(object: any, method: any, injectionConfig: IInjectionConfig) {
    let injection = <Injection>Reflect.getMetadata('Injection', object, method) || [];

    injection.push(injectionConfig);

    Reflect.defineMetadata('Injection', injection, object, method);
  }

  public static run(object: any, method: any, context: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      let injection = <Injection>Reflect.getMetadata('Injection', object, method) || [];

      this.resolveInjection(object, method, injection, context).then((response: Response) => {
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

  public static resolveInjection(object: any, method: string, injection: Injection, context: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let returnPromises: Promise<any>[] = [];

      injection.forEach((injectionConfig) => {
        returnPromises[injectionConfig.injectable.index] = injectionConfig.injectionResolver.resolve(injectionConfig.injectable, context);
      });

      Promise.all(returnPromises).then((values: any[]) => {
        let returnValues: any[] = [];

        values.forEach((value, k) => {
          if(value instanceof Response) {
            returnValues.push(this.normalizeType(object, method, k, value.data));
          } else {
            returnValues.push(this.normalizeType(object, method, k, value));
          }
        });

        let rejected = false;
        for(let k = 0; k < returnValues.length; k++) {
          let returnValue = returnValues[k];
          if(ResponseService.isError(returnValue)) {
            rejected = true;
            reject(returnValue);
          }
        }

        if(!rejected) {
          resolve(returnValues);
        }
      }).catch((response: any) => {
        reject(response);
      });
    });
    
  }

  public static normalizeType(object: any, method: string, index: number, value: any): any {
    if(value === null || value === undefined) {
      return value;
    }

    let paramTypes = Reflect.getMetadata('design:paramtypes', object, method);
    let badType = false;
    if(paramTypes) {
      let paramType = paramTypes[index];

      switch(paramType) {
        case String:
          return String(value);
        case Number:
          if(!isNaN(value)) {
            return Number(value);
          }
          
          badType = true;
          break;
        case Integer:
          if(!isNaN(value)) {
            return Integer.fromValue(value);
          }
          
          badType = true;
          break;
        case Boolean:
          if(value.toLowerCase() === 'true') {
            return true;
          } else if(value.toLowerCase() === 'false') {
            return false;
          }

          return Boolean(value);
        case Object:
          if(value instanceof Object) {
            return value;
          }

          badType = true;
          break;
        case Array:
          if(value instanceof Array) {
            return value;
          }

          badType = true;
          break;
        case Date:
          if(typeof value === 'string') {
            value = new Date(value);

            if(value.toString() === 'Invalid Date') {
              badType = true;
            } else {
              return value;
            }
          }
          break;
      }

      if(badType) {
        return Response.BadRequest(`Expected '${value}' to be an instance of ${paramType.name || paramType}. Got ${typeof value}`);
      }
    } else {
      fatal(new Error('Unable to resolve injection types. Please set `emitDecoratorMetadata` to true in your tsconfig.'));
    }
    
    return value;    
  }

}