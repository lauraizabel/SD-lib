import { scoped, registry, Lifecycle } from "tsyringe";
import { MethodsInterface } from "../interfaces/MethodsInterface";

interface Route {
  path: string;
  controller: (aux: any) => any;
  method: MethodsInterface;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "RoutesService", useClass: RoutesService }])
export default class RoutesService {
  private routes: Route[] = [];

  constructor() {}

  addRoute(route: Route) {
    this.routes.push(route);
  }

  getRoute(path: string, method: MethodsInterface) {
    this.routes.find((route) => route.path === path && route.method === method);
  }
}
