import findFreePorts from "find-free-ports";
import { ipv4Ips } from "./utils/NetworkUtils";

import HttpService from "./services/ServerService";
import RoutesService, { Route } from "./services/RoutesService";
import DnsConnectionService, { DnsConfig } from "./services/DnsConnectionService";
import ClientService from "./services/ClientService";

export class App {
  private routeService = new RoutesService();
  private readonly httpService = new HttpService(this.routeService);
  private readonly dnsConnectionService = new DnsConnectionService();
  private readonly clientService = new ClientService();

  private readonly port: number;
  private readonly address: string;
  private readonly serviceName: string;

  constructor(port: number, serviceName: string) {
    this.port = port;
    // aqui ele pega automaticamente o valor do ip da máquina, caso nao exista
    // ele usa localhost como default
    this.address = ipv4Ips[0]?.address || "127.0.0.1";
    this.serviceName = serviceName;
  }

  async server() {
    await this.httpService.start(this.port, this.address);

    // Aqui ta as configs pra se conectar com o dns, 
    // coloquei tudo como fixo (do dns) pq nao sabia como fazer, mas acho q assim
    // ta de boa.
    const setServerOnParams: DnsConfig = {
      config: {
        address: this.address,
        method: 'SET',
        port: this.port,
        serviceName: this.serviceName,
      },
      dnsAddress: "127.0.0.1",
      dnsPort: 1234,
    };

    await this.dnsConnectionService.setServerOn(setServerOnParams);
  }

  async client() {
    await this.clientService.receiveData(
      { hostname: "127.0.0.1", port: 3004 },
      { body: JSON.stringify({ hi: "dude" }), path: "/comments" }
    );
  }

  route(route: Route) {
    this.routeService.addRoute(route);
  }
}

const app = new App(3001, 'setStudent');

const init = async () => {
  app.route({
    path: "",
    method: "POST",
    controller: (req, res) => {
      return {
        json: { message: "OK" },
        status: 200,
      };
    },
  });

  // await app.server(3001, "localhost");

  await app.client();
};

init();

export default app;
