import net from "net";
import { IpPortInterface } from "../interfaces/IpPortInterface";
import DnsConnectionService from "./DnsConnectionService";

export default class ClientService {
  private dnsCon = new DnsConnectionService();
  private knownServices: any = {};
  private readonly dsnConfig: IpPortInterface | undefined;

  constructor(dnsConfig?: IpPortInterface) {
    if (dnsConfig) {
      this.dsnConfig = dnsConfig;
    }
  }

  private formatResponse = (data: string): any => {
    try {
      const [http, status, response] = data.split(" ");
      const startJsonIdx = response.indexOf("{");
      return {
        status,
        response:
          startJsonIdx !== -1
            ? JSON.parse(response.substring(startJsonIdx - 1))
            : response,
      };
    } catch (error) {
      return data;
    }
  };

  private getConnection(port?: number, path?: string): net.Socket | undefined {
    if (!port || !path) return undefined;
    const connection = net
      .connect(port, path, () =>
      {}
      )
      .on("error", () =>
      {}
      )
      .on("connect", () => {});
    return connection;
  }

  private findKnownServer = (serverName: string): any =>
    this.knownServices[serverName] ? this.knownServices[serverName] : undefined;

  async receiveData(service: string, server?: IpPortInterface) {
    if (!server) server = this.findKnownServer(service);
    if (!server && this.dsnConfig) {
      const object: IpPortInterface = await this.dnsCon.getIpAndPort(
        service,
        this.dsnConfig.path,
        this.dsnConfig.port
      );
      if (object) {
        server = object;
      }
    } else if(!this.dsnConfig) {
      console.log("[ERROR] - Sem informações de servidor ou DNS");
      return;
    }

    
    if (server?.path === undefined || server.port === undefined) {
      console.log("[ERROR] - servidor inalcançável");
      return;
    }

    this.knownServices[service] = server;

    const writeString = `
        GET ${service} HTTP/1.1
        Content-Type: application/json
        Connection: keep-alive
        Host: ${server?.path}:${server?.port}
        path: ${service}
        method: GET
      `;

    return new Promise((resolve, reject) => {
      const connection = this.getConnection(server?.port, server?.path);
      if (connection)
        connection
          .on("data", (data) => {
            try {
              resolve(this.formatResponse(data.toString()));
            } catch (error) {
              resolve(data.toString());
            }
            connection.destroy();
          })
          .on("error", (err) => reject(err))
          .write(writeString);
    });
  }

  async sendData(
    service: string,
    body: Object | string,
    server?: IpPortInterface
  ) {
    console.log(this.knownServices);

    if (!server) server = this.findKnownServer(service);

    if (!server && this.dsnConfig) {
      const object: IpPortInterface = await this.dnsCon.getIpAndPort(
        service,
        this.dsnConfig.path,
        this.dsnConfig.port
      );
      
      if (object) {
        server = object;
      }
    } else if(!this.dsnConfig) {
      console.log("[ERROR] - Sem informações de servidor ou DNS");
      return;
    }

    if (server?.path === undefined || server.port === undefined) {
      console.log("[ERROR] - servidor inalcançável");
      return;
    }

    this.knownServices[service] = server;

    let newBody = "";
    try {
      newBody = JSON.stringify(body);
    } catch (error) {
      newBody = body as string;
    }

    const writeString = `
          POST ${service} HTTP/1.1
          Content-Type: application/json
          Host: ${server?.path}:${server?.port}
          Connection: keep-alive
          path: ${service}
          method: POST
          Content-Length: ${newBody.length}
          Body: ${newBody}
        `;
    return new Promise((resolve, reject) => {
      const connection = this.getConnection(server?.port, server?.path);
      if (connection)
        connection
          .on("data", (data) => {
            try {
              resolve(this.formatResponse(data.toString()));
            } catch (error) {
              resolve(data.toString());
            }
            connection.destroy();
          })
          .on("error", (err) => reject(err))
          .write(writeString);
    });
  }
}
