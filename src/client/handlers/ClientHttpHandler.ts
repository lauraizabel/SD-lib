import { scoped, registry, Lifecycle, inject } from "tsyringe";

import { LoggerServiceInterface } from "../../common/interfaces/LoggerServiceInterface";
import { UrlUtilsInterface } from "../../common/interfaces/UrlUtilInterface";
import { HttpUtilsInterface } from "../../common/interfaces/HttpUtilsInterface";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "ClientHttpHandler", useClass: ClientHttpHandler }])
export default class ClientHttpHandler {
  constructor(
    @inject("LoggerService") private logger: LoggerServiceInterface,
    @inject("UrlUtils") private urlUtils: UrlUtilsInterface,
    @inject("HttpUtils") private httpUtils: HttpUtilsInterface
  ) {}

  send(url: string, data: Object, method: "PUT" | "POST") {
    const postData = JSON.stringify(data);
    const url_ = this.urlUtils.validateUrl(url);

    if (!url_) {
      throw new Error("Invalid url");
    }

    const { hostname, pathname: path, searchParams } = url_;

    const options = {
      hostname,
      path,
      method,
      searchParams,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };
    this.httpUtils.sendData(options, postData);
  }

  recive(url: string) {
    const url_ = this.urlUtils.validateUrl(url);

    if (!url_) {
      throw new Error("Invalid url");
    }

    const { hostname, pathname: path, searchParams } = url_;

    const options = {
      hostname,
      path,
      method: "GET",
      searchParams,
    };

    this.httpUtils.reciveData(options);
  }
}
