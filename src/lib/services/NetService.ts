import net from "net";
import { scoped, registry, Lifecycle, inject } from "tsyringe";
import { LoggerServiceInterface } from "../interfaces/LoggerServiceInterface";

import RoutesService from "./RoutesService";
import { MethodsInterface } from "../interfaces/MethodsInterface";
import { STATUS_CODES } from "../consts/status-code-const";
import { RequestInterface } from "../interfaces/RequestInterface";
import { response as responseDefault } from "../consts/response-const";
import { ResponseInterface } from "../interfaces/ResponseInterface";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "NetService", useClass: NetService }])
export default class NetService {
  constructor(
    @inject("LoggerService") private logger: LoggerServiceInterface,
    @inject("RoutesService") private routesService: RoutesService
  ) {}

  start(port: number, host: string): void {
    try {
      const server = net.createServer(this.createServer);
      this.logger.info(`Server runing on port ${port}`);

      server.listen(port, host);
    } catch (error) {
      console.log(error);
    }
  }

  createServer = (socket: net.Socket): void => {
    socket.on("data", (data) => this.receiveCallback(data, socket));
  };

  transformDataBufferInRequestObject(buffer: Buffer): RequestInterface {
    const [requestHeader, ...bodyContent] = buffer.toString().split("\r\n\r\n");

    const [firstLineBuffer, ...otherBufferLines] = requestHeader.split("\n");

    const [method, path, httpVersion] = firstLineBuffer.trim().split(" ");

    const arrayToBeAHeaderObject = otherBufferLines
      .filter((_) => _)
      .map((line) => line.split(":").map((part) => part.trim()))
      .map(([name, ...rest]) => [name, rest.join(" ")]);

    const headers = Object.fromEntries(arrayToBeAHeaderObject);

    const request: RequestInterface = {
      method,
      path,
      httpVersion,
      headers,
      body: {},
    };

    try {
      request.body = JSON.parse(bodyContent[0]);
    } catch (error) {
      request.body = {};
    }

    return request;
  }

  buildStatusCode = (response: ResponseInterface | void) => {
    let status: { code: number; message: string };

    status = {
      code: response?.status ?? 200,
      message:
        STATUS_CODES[(response?.status as keyof typeof STATUS_CODES) ?? 200],
    };

    return status;
  };

  buildJsonResponse = (response: ResponseInterface | void) => {
    let json = "";

    if (response && response.json) {
      json = JSON.stringify(response.json);
    }

    return json;
  };

  receiveCallback(dataBuffer: Buffer, socket: net.Socket) {
    const request = this.transformDataBufferInRequestObject(dataBuffer);

    const controller = this.routesService.getRoute(
      request.path,
      request.method as MethodsInterface
    );

    if (!controller) {
      socket.write(`HTTP/1.1 404 ${STATUS_CODES[404]}\n\n`);
      socket.end();
      return;
    }

    const response = controller?.controller(request, responseDefault);

    const status = this.buildStatusCode(response);

    const json = this.buildJsonResponse(response);

    socket.write(`HTTP/1.1 ${status.code} ${status.message}\n\n${json}`);
    socket.end();
  }
}
