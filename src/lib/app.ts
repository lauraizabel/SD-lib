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
  private  readonly clientService : ClientService;

  private readonly port: number;
  private readonly address: string;
  private readonly serviceName: string;

  constructor(appConfig: ConfigAppInterface) {
    this.clientService = new ClientService(appConfig.dnsConfig)
    // this.clientService = new ClientService(appConfig.clientConfig);
    this.port = appConfig.port;
    // aqui ele pega automati'camente o valor do ip da máquina, caso nao exista
    // ele usa localhost como default
    this.address = ipv4Ips[0]?.address || "127.0.0.1";
    this.serviceName = appConfig.serviceName;
  }

  async server() {
    await this.httpService.start(this.port, this.address);

    // Aqui ta as configs pra se conectar com o dns,
    // coloquei tudo como fixo (do dns) pq nao sabia como fazer, mas acho q assim
    // ta de boa.
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

  // esse client() poderia ser alterado para apenas utilizar a propria classe instanciada, ao inves de declarar ela aqui
  // ela sendo declarada aqui, obriga ao cliente ter que setar os parametros que ele nao deveria saber 
  // portanto, acho que ver se faz sentido se aqui realmente é necessário faz sentido.
  client() {
    return this.clientService;
  }

  route(route: Route) {
    this.routeService.addRoute(route);
  }
}

const clientConfigJSON :IpPortInterface = { path: "127.0.0.1", port: 1234 };
const appConfigJSON : ConfigAppInterface = { port: 3002, serviceName: "/comment", mode: "server", dnsConfig:clientConfigJSON };

const app = new App(appConfigJSON);

const init = async () => {
  const data = await app
    .server()
  app.route({
    path: 'comment', controller(request, response) {
      console.log("Chegou ao controller");
    return {status: 200,json: "Chegou"};
  },
  method: "GET"})

  console.log(data);
    
};

init();

export default app;
