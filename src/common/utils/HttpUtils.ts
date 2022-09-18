import Http from "node:http";

import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { HttpUtilsInterface } from "../interfaces/HttpUtilsInterface";
import { LoggerServiceInterface } from "../interfaces/LoggerServiceInterface";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "HttpUtils", useClass: HttpUtils }])
export default class HttpUtils implements HttpUtilsInterface {
  constructor(
    @inject("LoggerService") private logger: LoggerServiceInterface
  ) {}

  sendData(options: string | URL | Http.RequestOptions, postData: Object) {
    const req = Http.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => {});
      res.on("end", () => {
        this.logger.info("No more data in response.");
      });
    });

    req.on("error", (e) => {
      this.logger.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
  }

  reciveData(options: string | URL | Http.RequestOptions) {
    const req = Http.request(options, (res) => {
      this.logger.info(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    req.on("error", (error) => {
      this.logger.error(JSON.stringify(error));
    });

    req.end();
  }
}
