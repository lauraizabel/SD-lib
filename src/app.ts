import "reflect-metadata";
import ClientHttpHandler from "./client/handlers/ClientHttpHandler";
import ClusterService from "./common/services/ClusterService";
import LoggerService from "./common/services/LoggerService";
import HttpUtils from "./common/utils/HttpUtils";
import UrlUtils from "./common/utils/UrlUtils";

export default class App {
  private readonly loggerService = new LoggerService();
  private readonly clusterService = new ClusterService(this.loggerService);
  private readonly urlUtil = new UrlUtils(this.loggerService);
  private readonly httpUtils = new HttpUtils(this.loggerService);

  private readonly clientHandler = new ClientHttpHandler(
    this.loggerService,
    this.urlUtil,
    this.httpUtils
  );

  private readonly clientHttp = new ClientHttpHandler(
    this.loggerService,
    this.urlUtil,
    this.httpUtils
  );

  constructor() {
    this.clusterService.start();
    this.clientHttp.recive("https://jsonplaceholder.typicode.com/todos/1");
  }
}

new App();
