import { cpus } from "os";
import cluster from "node:cluster";
import { scoped, registry, Lifecycle, inject } from "tsyringe";
import { LoggerServiceInterface } from "../interfaces/LoggerServiceInterface";
import { ClusterServiceInterface } from "../interfaces/ClusterServiceInterface";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "ClusterService", useClass: ClusterService }])
export default class ClusterService implements ClusterServiceInterface {
  private readonly numCpus = cpus.length;

  constructor(
    @inject("LoggerService") private logger: LoggerServiceInterface
  ) {}

  start() {
    if (cluster.isPrimary) {
      this.startWorkers();
    }
  }

  private startWorkers() {
    this.logger.info(`Primary ${process.pid} is running`);

    for (let cpu = 0; cpu < this.numCpus; cpu++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      this.logger.info(`worker ${worker.process.pid} died`);
    });
  }
}
