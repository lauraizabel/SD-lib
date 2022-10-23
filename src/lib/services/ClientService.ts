import net from "net";
import { IpPortInterface } from "../interfaces/IpPortInterface";
import DnsConnectionService from "./DnsConnectionService";

interface ConfigNet {
  hostname: string;
  port: number;
}

// Para passar o body para a requisicao vai precisar passar como string,
// com um JSON.stringfy()
interface ConfigClient {
  path: string;
  body?: string;
}


// Ponto de melhoria:
// as duas funcoes estao utilizando o mesmo código, poderia mudar
// pra usar apenas um método;
export default class ClientService {
  private dnsCon = new DnsConnectionService();
  private knownServices: any = {}
  private readonly dsnConfig: IpPortInterface | undefined;

  // private hostname: string;
  // private port: number;
  
  constructor(dnsConfig?: IpPortInterface) {
    if (dnsConfig) {
      this.dsnConfig = dnsConfig;
    }
  }

  // private getConnection(clientConfigJSON?: ConfigNet): net.Socket {
  //   const path = clientConfigJSON?.hostname || this.hostname;
  //   const port = clientConfigJSON?.port || this.port;
    
  //   if(!path || !port) throw new Error("Sem informações do servidor do Client")

  private getConnection(path: string, port: number): net.Socket {
    const connection = net
      .connect(port, path, () =>
        console.info("[getConnection] - connected to server")
      )
      .on("error", () =>
        console.log("[getConnection] - ERROR WHEN TRY CONNECT")
      )
      .on("connect", () => console.log("[getConnection] - connected"));
    return connection;
  }

  private findKnownServer = (serverName: string): any =>
    this.knownServices[serverName] ? this.knownServices[serverName] : undefined;

  // async receiveData({ hostname, port }: ConfigNet, { path }: ConfigClient) {
  async receiveData(service: string, server?: IpPortInterface) {
    console.log(service, this.dsnConfig)
    if (!server) server = this.findKnownServer(service);
    if (!server && this.dsnConfig) {
      const dnsCon = new DnsConnectionService();
      const object = await dnsCon.getIpAndPort(service, this.dsnConfig.path, this.dsnConfig.port)
      if (object) {
        console.log('DNS RESPONSE',object)
        // const { path, port } = object;
      }

    } else {
      console.log("[ERROR] - Sem informações de servidor ou DNS")
    }
    if(!server?.path || !server.port) { console.log("[ERROR] - servidor inalcançável")}
    

      const writeString = `
        GET ${service} HTTP/1.1
        Content-Type: application/json
        Connection: keep-alive
        Host: ${server?.path}:${server?.port}
      `;
    
    // return new Promise((resolve, reject) => {
    //   const connection = this.getConnection(server?.path, server?.port);
    //     connection
    //       .on("data", (data) => {
    //         try {
    //           resolve(JSON.parse(data.toString()));
    //         } catch (error) {
    //           resolve(data.toString());
    //         }
    //         connection.destroy();
    //       })
    //       .on("error", (err) => reject(err))
    //       .write(writeString);      
    // });
  }

  sendData({ hostname, port }: ConfigNet, { body, path }: ConfigClient) {
  // sendData(service: string , body: any, server?: ConfigNet) {
    return new Promise((resolve, reject) => {
      const connection = this.getConnection(hostname, port);

      const writeString = `
          POST ${path} HTTP/1.1
          Content-Type: application/json
          Host: ${hostname}:${port}
          Connection: keep-alive
          Content-Length: ${body?.length}
          ${body}
        `;

      connection
        .on("data", (data) => {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (error) {
            resolve(data.toString());
          }
        })
        .on("error", (err) => reject(err))
        .write(writeString);
    });
  }
}
