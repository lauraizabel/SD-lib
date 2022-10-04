import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { LoggerServiceInterface } from "../interfaces/LoggerServiceInterface";
import { UrlUtilsInterface } from "../interfaces/UrlUtilInterface";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "UrlUtils", useClass: UrlUtils }])
export default class UrlUtils implements UrlUtilsInterface {
  constructor(
    @inject("LoggerService") private logger: LoggerServiceInterface
  ) {}

  validateUrl(url: string): URL | undefined {
    try {
      return new URL(url);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
  }
}
