import {RestkitRouter} from '../router';

export abstract class RestkitServer {
  public package: any;

  public application: any;

  public listenHandle: any;

  public baseRouter: RestkitRouter;

  public abstract createRouter (... args: any[]): RestkitRouter;
  
  public abstract listen (... args: any[]): any;

  public abstract stop(... args: any[]): any;
  
  public abstract use (... args: any[]): any;
  
  public abstract getRequestHandler(... args: any[]): Function;
  
  public abstract sendResponse(... args: any[]): any;
}