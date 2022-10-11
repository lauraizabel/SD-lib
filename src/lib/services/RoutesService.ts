import { scoped, registry, Lifecycle } from "tsyringe";
import { MethodsInterface } from "../interfaces/MethodsInterface";
import { RequestInterface } from "../interfaces/RequestInterface";
import { ResponseInterface } from "../interfaces/ResponseInterface";

export interface Route {
  path: string;
  controller: (
    request: RequestInterface,
    response: ResponseInterface
  ) => ResponseInterface | void;
  method: MethodsInterface;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "RoutesService", useClass: RoutesService }])
export default class RoutesService {
  private routes: Route[] = [];

  constructor() {}

  public addRoute = (route: Route) => {
    this.routes.push(route);
  };

  public getRoute = (path: string, method: MethodsInterface) => {
    return this.routes.find(
      (route) => route.path === path.replace("/", "") && route.method === method
    );
  };
}
