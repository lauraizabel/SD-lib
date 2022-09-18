import { createLogger, Logger, transports, format } from "winston";
import { scoped, registry, Lifecycle } from "tsyringe";
import { LoggerServiceInterface } from "../interfaces/LoggerServiceInterface";

const { combine, timestamp, errors, json } = format;

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "LoggerService", useClass: LoggerService }])
export default class LoggerService implements LoggerServiceInterface {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: "info",
      transports: [
        new transports.Console({
          handleExceptions: true,
        }),
      ],
      format: combine(
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        errors({ stack: true }),
        json()
      ),
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
