import {Response} from './response';

export class ResponseService {  

  public static isSuccess(res: Response): boolean {
    return res.httpCode >= 200 && res.httpCode < 300;
  }

  public static isError(res: Response): boolean {
    return res.httpCode >= 400;
  }

  public static isRedirect(res: Response): boolean {
    return res.httpCode >= 300 && res.httpCode < 400;
  }

  public static convertSuccessResponse(data: any): Response {
    if(data instanceof Response) {
      return data;
    }
    
    if(data) {
      return Response.Ok(data);
    } else {
      return Response.None();
    }
  }

  public static convertErrorResponse(data: any): Response {
    if(data instanceof Response) {
      return data;
    } else if (data instanceof Error) {
      data = data.stack.toString();
    }

    return Response.Error(data);
  }

}