import net from "net";

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

  receiveData({ hostname, port }: ConfigNet, { path }: ConfigClient) {
    return new Promise((resolve, reject) => {
      const connection = this.getConnection(hostname, port);
      const writeString = `
        GET ${path} HTTP/1.1
        Content-Type: application/json
        Connection: keep-alive
        Host: ${hostname}:${port}
      `;

      connection
        .on("data", (data) => {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (error) {
            resolve(data.toString());
          }
          connection.destroy();
        })
        .on("error", (err) => reject(err))
        .write(writeString);
    });
  }

  sendData({ hostname, port }: ConfigNet, { body, path }: ConfigClient) {
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
