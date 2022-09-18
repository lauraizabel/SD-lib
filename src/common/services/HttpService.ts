import { scoped, registry, Lifecycle, inject } from "tsyringe";
import Http from "node:http";
import { LoggerServiceInterface } from "../interfaces/LoggerServiceInterface";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "HttpService", useClass: HttpService }])
export default class HttpService {
  constructor(
    @inject("LoggerService") private logger: LoggerServiceInterface
  ) {}

  start(url?: string, body?: Object) {}

  startClient(url: string, body: Object) {}

  startServer() {}
}
