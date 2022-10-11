import "reflect-metadata";
import { RequestInterface } from "./common/interfaces/RequestInterface";
import { ResponseInterface } from "./common/interfaces/ResponseInterface";
import LoggerService from "./common/services/LoggerService";
import NetService from "./common/services/NetService";
import RoutesService from "./common/services/RoutesService";

const testingController = (
  request: RequestInterface,
  response: ResponseInterface
) => {
  const newResponse: ResponseInterface = {
    status: 400,
    json: {
      error: "algo deu errado :(",
    },
  };
  return newResponse;
};

export default class App {
  private readonly loggerService = new LoggerService();
  private readonly routeService = new RoutesService();
  private readonly netService = new NetService(
    this.loggerService,
    this.routeService
  );

  constructor() {
    this.routeService.addRoute({
      controller: testingController,
      method: "GET",
      path: "testando",
    });
    this.netService.start();
  }
}

new App();
