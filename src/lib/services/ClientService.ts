import net from "net";
import { ClientInterface } from "../interfaces/ClientInterface";
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
  // private hostname: string;
  // private port: number;
  
  // constructor(clientConfigJSON?: ConfigNet) {
  //   if (clientConfigJSON) {
  //     this.hostname = clientConfigJSON.hostname;
  //     this.port = clientConfigJSON.port;
  //   }
  // }

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

  async receiveData({ hostname, port }: ConfigNet, { path }: ConfigClient) {

    console.log('dsn start')
    const dnsCon = new DnsConnectionService();
    const object = await dnsCon.getIpAndPort('student', "127.0.0.1", 1234)
    console.log(object)
    // return new Promise((resolve, reject) => {
    //   const connection = this.getConnection(hostname, port);
      const writeString = `
        GET ${path} HTTP/1.1
        Content-Type: application/json
        Connection: keep-alive
        Host: ${hostname}:${port}
      `;

    //   connection
    //     .on("data", (data) => {
    //       try {
    //         resolve(JSON.parse(data.toString()));
    //       } catch (error) {
    //         resolve(data.toString());
    //       }
    //       connection.destroy();
    //     })
    //     .on("error", (err) => reject(err))
    //     .write(writeString);
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
