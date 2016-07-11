declare var require: any;
declare var process: any;

import {RouteManager} from './route';
import {RestkitServer} from './server';
import {IStaticUriPath} from './route';
import {fatal} from './error';

export interface IRestkitConfig {
  server: RestkitServer;
  port?: number;
  timezone?: string;
  staticFiles?: IStaticUriPath[];
  staticPaths?: IStaticUriPath[];
  middleware?: any[];
}

export class Restkit {

  public static server: any;
  
  public static config: IRestkitConfig;

  public static initDefaultRestkitConfig(config: IRestkitConfig) {
    this.config = config;
    
    config.port = config.port || 8000;
    config.timezone = config.timezone || 'Z';
    config.staticFiles = config.staticFiles || [];
    config.staticPaths = config.staticPaths || [];
    
    this.server = config.server;

    config.middleware = config.middleware || [];
    
  }

  /**
   * Starts an application instance
   */
  public static start(config: IRestkitConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.initDefaultRestkitConfig(config);
      
      process.env.TZ = config.timezone;
      this.resolveMiddleware(config.middleware).then((middlewares: any[]) => {
        this.bindMiddleware(middlewares);

        RouteManager.bindStaticPaths(this.server, config.staticPaths);
        RouteManager.bindStaticFiles(this.server, config.staticFiles);
        RouteManager.bindRoutes(this.server);

        this.server.listen(config.port, () => {
          console.log(`Started server on port ${config.port}`);
          resolve(config);
        })
      }).catch((err: any) => {
        reject(err);
      });
    }).catch((err: any) => {
      fatal(err);
    });
  }

  public static async resolveMiddleware(middlewares: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let promises: Promise<any>[] = [];

      middlewares.forEach((middleware) => {
        if(middleware instanceof Promise) {
          promises.push(middleware);
        } else {
          promises.push(Promise.resolve(middleware));
        }
      });

      Promise.all(promises).then((resolvedMiddleware) => {
        resolve(resolvedMiddleware);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public static async bindMiddleware(middlewares: any[]): Promise<any> {
    middlewares.forEach((middleware) => {
      if(middleware instanceof Array) {
        this.bindMiddleware(middleware);
      } else {
        this.server.use(middleware);
      }
    });
  }

  /**
   * Closes the application instance
   */
  public static stop() {
    console.log('closed application');
    this.server.close();
  }
}