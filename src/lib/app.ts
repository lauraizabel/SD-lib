import "reflect-metadata";

import LoggerService from "./services/LoggerService";
import NetService from "./services/NetService";
import RoutesService from "./services/RoutesService";

export class App {
  private readonly loggerService = new LoggerService();
  routeService = new RoutesService();
  private readonly netService = new NetService(
    this.loggerService,
    this.routeService
  );

  start(port: number) {
    this.netService.start(port);
  }
}

const app = new App();

export default app;
