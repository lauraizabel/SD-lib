import net from "net";

interface ConfigNet {
  hostname: string;
  port: number;
}

// Para passar o body para a requisicao vai precisar passar como string,
// com um JSON.stringfy()
interface ConfigClient {
  path: string;
  body: string;
}

export default class ClientService {
  private async getConnection(path: string, port: number): Promise<net.Socket> {
    const connection = await net
      .connect(port, path, () => {
        console.info("[getConnection] - connected to server");
      })
      .on("error", () =>
        console.log("[getConnection] - ERROR WHEN TRY CONNECT")
      )
      .on("connect", () => console.log("[getConnection] - connected"));
    return connection;
  }

  async receiveData({ hostname, port }: ConfigNet, { path }: ConfigClient) {
    let object: Object = {};

    const connection = await this.getConnection(hostname, port);

    const writeString = `
      GET ${path} HTTP/1.1
      Content-Type: application/json
      Host: ${hostname}:${port}
      `;

    // Problema ta ao enviar o dado de volta pro cliente receber, nao achei maneira de resolver isso
    // por enqt
    const test = await connection
      .on("data", (data) => {
        object = data.toString();
        console.log("[receiveData] - ", object);

        return object;
      })
      .write(writeString);

    console.log(object, test, "test");
  }

  async sendData({ hostname, port }: ConfigNet, { body, path }: ConfigClient) {
    let object: Object = {};

    const connection = await this.getConnection(hostname, port);

    const writeString = `
      POST ${path} HTTP/1.1
      Content-Type: application/json
      Host: ${hostname}:${port}
      Connection: keep-alive
      Content-Length: ${body.length}
      ${body}
    `;

    await connection
      .on("data", (data) => {
        object = data.toString();

        return object;
      })
      .write(writeString);
  }
}
