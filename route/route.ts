import {RouteMethod, RouteManager} from './manager';

export function Route(method: RouteMethod,
                              path: string) {
  return function(obj: any, key: string) {
    RouteManager.registerRoute(method, path, obj, key);
  }
}

export function GET(path: string) {
  return function(obj: any, key: string) {
    RouteManager.registerRoute('GET', path, obj, key);
  }
}

export function POST(path: string) {
  return function(obj: any, key: string) {
    RouteManager.registerRoute('POST', path, obj, key);
  }
}

export function PUT(path: string) {
  return function(obj: any, key: string) {
    RouteManager.registerRoute('PUT', path, obj, key);
  }
}

export function PATCH(path: string) {
  return function(obj: any, key: string) {
    RouteManager.registerRoute('PATCH', path, obj, key);
  }
}

export function DELETE(path: string) {
  return function(obj: any, key: string) {
    RouteManager.registerRoute('DELETE', path, obj, key);
  }
}