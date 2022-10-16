import "reflect-metadata";

import HttpService from "./services/HttpService";
import RoutesService, { Route } from "./services/RoutesService";
import DnsConnectionService from "./services/DnsConnectionService";

export class App {
  private routeService = new RoutesService();
  private readonly httpService = new HttpService(this.routeService);
  private readonly dnsConnectionService = new DnsConnectionService();

  async start(port: number, host: string) {
    await this.httpService.start(port, host);
  }

  async setDnsConnection(
    port: number,
    host: string,
    keepAlive: boolean = false
  ) {
    await this.dnsConnectionService.startConnection(host, port, keepAlive);
  }

  route(route: Route) {
    this.routeService.addRoute(route);
  }
}

const app = new App();

export default app;
