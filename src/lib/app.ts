import "reflect-metadata";

import LoggerService from "./services/LoggerService";
import NetService from "./services/NetService";
import RoutesService, { Route } from "./services/RoutesService";

export class App {
  private readonly loggerService = new LoggerService();
  private routeService = new RoutesService();
  private readonly netService = new NetService(
    this.loggerService,
    this.routeService
  );

  start(port: number, host: string) {
    this.netService.start(port, host);
  }

  route(route: Route) {
    this.routeService.addRoute(route);
  }
}

const app = new App();

export default app;
