import net from "net";
import { scoped, registry, Lifecycle, inject } from "tsyringe";
import { LoggerServiceInterface } from "../interfaces/LoggerServiceInterface";
import { ClusterServiceInterface } from "../interfaces/ClusterServiceInterface";
import RoutesService from "./RoutesService";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "NetService", useClass: NetService }])
export default class NetService implements ClusterServiceInterface {
  constructor(
    @inject("LoggerService") private logger: LoggerServiceInterface,
    @inject("RoutesService") private routesService: RoutesService
  ) {
    console.log(this.routesService);
  }

  start() {
    try {
      const server = net.createServer(this.createServer);
      this.logger.info("Server runing on port 1337");
      server.listen(1337, "127.0.0.1");
    } catch (error) {
      console.log(error);
    }
  }

  createServer(socket: net.Socket) {
    socket.on("data", (data) => {
      const [requestHeader, ...bodyContent] = data.toString().split("\r\n\r\n");

      const [firstLineBuffer, ...otherBufferLines] = requestHeader.split("\n");

      const [method, path, httpVersion] = firstLineBuffer.trim().split(" ");

      const arrayToBeAnObject = otherBufferLines
        .filter((_) => _)
        .map((line) => line.split(":").map((part) => part.trim()))
        .map(([name, ...rest]) => [name, rest.join(" ")]);

      const headers = Object.fromEntries(arrayToBeAnObject);

      const request = {
        method,
        path,
        httpVersion,
        headers,
        body: {},
      };

      try {
        request.body = JSON.parse(bodyContent[0]);
      } catch (error) {
        this.logger.error("error when try parse bodycontent");
      }

      console.log(request);

      socket.write("HTTP/1.1 200 OK\n\nhallo world");

      socket.end(() => {
        console.log("Finish");
      });
    });
  }

  receiveCallback(dataBuffer: Buffer, socket: net.Socket) {
    const bufferToString = dataBuffer.toString();

    const [firstLineBuffer, ...otherBufferLines] = bufferToString.split("\n");

    const [method, path, httpVersion] = firstLineBuffer.trim().split(" ");

    const test = otherBufferLines
      .filter((_) => _)
      .map((line) => line.split(":").map((part) => part.trim()))
      .map(([name, ...rest]) => [name, rest.join(" ")]);

    const headers = Object.fromEntries(
      otherBufferLines
        .filter((_) => _)
        .map((line) => line.split(":").map((part) => part.trim()))
        .map(([name, ...rest]) => [name, rest.join(" ")])
    );

    const request = {
      method,
      path,
      httpVersion,
      headers,
    };

    console.log(request);

    socket.write("HTTP/1.1 200 OK\n\nhallo world");

    socket.end(() => {
      console.log("Finish");
    });
  }
}
