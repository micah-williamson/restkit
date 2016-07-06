import {Reflect} from '../';

import {Response} from './response';

export class ResponseService {  

  public static isSuccess(res: any): boolean {
    if(res instanceof Response) {
      return res.httpCode >= 200 && res.httpCode < 300;
    } else if (res instanceof Error) {
      return false;
    }

    return true; 
  }

  public static isError(res: any): boolean {
    if(res instanceof Response) {
      return res.httpCode >= 400;
    } else if (res instanceof Error) {
      return true;
    }

    return false;
  }

  public static isRedirect(res: Response): boolean {
    return res.httpCode >= 300 && res.httpCode < 400;
  }

  public static convertSuccessResponse(response: any, object: any, method: string): Response {
    if(response instanceof Response) {
      return response;
    } else {
      let defaultResponseCode = Reflect.getMetadata('ResponseCode', object, method);
      if(defaultResponseCode) {
        return new Response(defaultResponseCode, response);
      } else {
        if(response !== undefined) {
          return Response.Ok(response);
        }
        
        return Response.None()
      }
    }
  }

  public static convertErrorResponse(response: any, object: any, method: string): Response {
    if(response instanceof Response) {
      return response;
    } else if (response instanceof Error) {
      return Response.Error(response.stack.toString());
    } else {
      let defaultErrorCode = Reflect.getMetadata('ErrorCode', object, method);
      if(defaultErrorCode) {
        return new Response(defaultErrorCode, response);
      }
      
      return Response.Error(response);
    }
  }

}