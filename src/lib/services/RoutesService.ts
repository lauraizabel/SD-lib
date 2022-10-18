import { MethodsInterface } from "../interfaces/MethodsInterface";
import { RequestInterface } from "../interfaces/RequestInterface";
import { ResponseInterface } from "../interfaces/ResponseInterface";
import { RoutesServiceInterface } from "../interfaces/RoutesServiceInterface";

export interface Route {
  path: string;
  controller: (
    request: RequestInterface,
    response: ResponseInterface
  ) => Promise<ResponseInterface | void> | ResponseInterface | void;
  method: MethodsInterface;
}
export default class RoutesService implements RoutesServiceInterface {
  private routes: Route[] = [];

  constructor() {}

  public addRoute = (route: Route) => {
    this.routes.push(route);
  };

  public getRoute = (path: string, method: MethodsInterface) => {
    return this.routes.find(
      (route) => route.path === path.split("?")[0].replace("/", "") && route.method === method
    );
  };
}
