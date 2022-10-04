import "reflect-metadata";
import LoggerService from "./common/services/LoggerService";
import NetService from "./common/services/NetService";
import RoutesService from "./common/services/RoutesService";

export default class App {
  private readonly loggerService = new LoggerService();
  private readonly routeService = new RoutesService();
  private readonly netService = new NetService(
    this.loggerService,
    this.routeService
  );

  constructor() {
    this.routeService.addRoute({
      controller: (aux) => {},
      method: "GET",
      path: "testando",
    });
    console.log("criado", this.routeService);
    this.netService.start();
  }
}

new App();
