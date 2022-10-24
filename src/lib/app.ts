import findFreePorts from "find-free-ports";
import { ipv4Ips } from "./utils/NetworkUtils";

import HttpService from "./services/ServerService";
import RoutesService, { Route } from "./services/RoutesService";
import DnsConnectionService, {
  DnsConfig,
} from "./services/DnsConnectionService";
import ClientService from "./services/ClientService";
import { ConfigAppInterface } from "./interfaces/ConfigAppInterface";
import { IpPortInterface } from "./interfaces/IpPortInterface";

export class App {
  private routeService = new RoutesService();
  private readonly httpService = new HttpService(this.routeService);
  private readonly dnsConnectionService = new DnsConnectionService();
  private readonly clientService: ClientService;

  private readonly port: number;
  private readonly address: string;
  private readonly serviceName: string;

  constructor(appConfig: ConfigAppInterface) {
    this.clientService = new ClientService(appConfig.dnsConfig);
    this.port = appConfig.port;
    this.address = ipv4Ips[0]?.address || "127.0.0.1";
    this.serviceName = appConfig.serviceName;
  }

  async server() {
    await this.httpService.start(this.port, this.address);

    const setServerOnParams: DnsConfig = {
      config: {
        address: this.address,
        method: "SET",
        port: this.port,
        serviceName: this.serviceName,
      },
      dnsAddress: "127.0.0.1",
      dnsPort: 1234,
    };

    await this.dnsConnectionService.setServerOn(setServerOnParams);
  }

  client() {
    return this.clientService;
  }

  route(route: Route) {
    this.routeService.addRoute(route);
  }
}

const clientConfigJSON: IpPortInterface = { path: "127.0.0.1", port: 1234 };
const appConfigJSON: ConfigAppInterface = {
  port: 3001,
  serviceName: "setStudent",
  mode: "client",
  dnsConfig: clientConfigJSON,
};

const app = new App(appConfigJSON);

const init = async () => {
  const data: any = await app.client().sendData("comment", { nome: "cristal" });

  const data2: any = await app
    .client()
    .sendData("comment", { nome: "cristal2", testando: 'json' });

  console.log({ data });
  console.log({ data2 });
};

init();

export default app;
